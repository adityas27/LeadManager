import { useCallback, useEffect, useRef, useState } from "react";
import { leadService } from "../services/leadService";
import { parseApiErrors } from "../utils/errors";
import useDebouncedValue from "./useDebouncedValue";
import { useToast } from "./useToast.jsx";

const EMPTY_STATS = {
  total: 0,
  by_status: {
    NEW: 0,
    CONTACTED: 0,
    QUALIFIED: 0,
    LOST: 0,
  },
};

function normalizeStats(data) {
  const byStatus = data?.by_status ?? {};
  return {
    total: data?.total ?? 0,
    by_status: {
      NEW: byStatus.NEW ?? 0,
      CONTACTED: byStatus.CONTACTED ?? 0,
      QUALIFIED: byStatus.QUALIFIED ?? 0,
      LOST: byStatus.LOST ?? 0,
    },
  };
}

export default function useLeadManager() {
  const toast = useToast();
  const [leads, setLeads] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });
  const [stats, setStats] = useState(EMPTY_STATS);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const debouncedSearch = useDebouncedValue(search.trim(), 300);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState("");
  const requestId = useRef(0);
  const filtersRef = useRef({ search: "", status: "" });
  const liveFilters = useRef({ search: "", status: "" });
  filtersRef.current = { search: debouncedSearch, status };
  liveFilters.current = { search: search.trim(), status };

  const refreshStats = useCallback(async () => {
    try {
      const { data } = await leadService.stats();
      setStats(normalizeStats(data));
    } catch (err) {
      toast.error(parseApiErrors(err).form || "Could not load dashboard stats.");
    } finally {
      setStatsLoading(false);
    }
  }, [toast]);

  const refreshLeads = useCallback(async () => {
    const id = ++requestId.current;
    const { search: activeSearch, status: activeStatus } = filtersRef.current;
    const firstLoad = !requestId.current || id === 1;
    if (firstLoad && id === 1) setLoading(true);
    else setRefreshing(true);

    try {
      const params = {};
      params.page = page;
      if (activeSearch) params.search = activeSearch;
      if (activeStatus) params.status = activeStatus;
      const { data } = await leadService.list(params);
      if (id !== requestId.current) return;
      if (Array.isArray(data)) {
        const totalPages = Math.max(1, Math.ceil(data.length / 10));
        const safePage = Math.min(Math.max(page, 1), totalPages);
        const start = (safePage - 1) * 10;
        setLeads(data.slice(start, start + 10));
        setPagination({ count: data.length, next: null, previous: null });
        if (safePage !== page) setPage(safePage);
      } else {
        const nextLeads = Array.isArray(data?.results) ? data.results : [];
        const count = Number.isFinite(data?.count) ? data.count : nextLeads.length;
        setLeads(nextLeads);
        setPagination({
          count,
          next: data?.next ?? null,
          previous: data?.previous ?? null,
        });

        const totalPages = Math.max(1, Math.ceil(count / 10));
        if (page > totalPages) setPage(totalPages);
      }
      setError("");
    } catch (err) {
      if (id !== requestId.current) return;
      setError(parseApiErrors(err).form || "Could not load leads.");
    } finally {
      if (id === requestId.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [page]);

  useEffect(() => {
    refreshLeads();
  }, [debouncedSearch, status, page, refreshLeads]);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  const isHiddenByFilters = useCallback((payload) => {
    const { search: activeSearch, status: activeStatus } = liveFilters.current;
    const name = (payload.name || "").toLowerCase();
    const missesSearch = Boolean(activeSearch) && !name.includes(activeSearch.toLowerCase());
    const missesStatus = Boolean(activeStatus) && payload.status !== activeStatus;
    return missesSearch || missesStatus;
  }, []);

  const createLead = useCallback(
    async (payload) => {
      try {
        await leadService.create(payload);
        toast.success(
          isHiddenByFilters(payload)
            ? "Lead created. Clear the current filters to see it in the table."
            : "Lead created."
        );
        await Promise.all([refreshLeads(), refreshStats()]);
        return { ok: true, fieldErrors: {}, form: "" };
      } catch (err) {
        const parsed = parseApiErrors(err);
        if (!Object.keys(parsed.fieldErrors).length) {
          toast.error(parsed.form || "Could not create the lead.");
        }
        return { ok: false, ...parsed };
      }
    },
    [isHiddenByFilters, refreshLeads, refreshStats, toast]
  );

  const updateLead = useCallback(
    async (id, payload) => {
      try {
        await leadService.update(id, payload);
        toast.success(
          isHiddenByFilters(payload)
            ? "Lead updated. It no longer matches the current filters."
            : "Lead updated."
        );
        await Promise.all([refreshLeads(), refreshStats()]);
        return { ok: true, fieldErrors: {}, form: "" };
      } catch (err) {
        const parsed = parseApiErrors(err);
        if (!Object.keys(parsed.fieldErrors).length) {
          toast.error(parsed.form || "Could not update the lead.");
        }
        return { ok: false, ...parsed };
      }
    },
    [isHiddenByFilters, refreshLeads, refreshStats, toast]
  );

  const removeLead = useCallback(
    async (id) => {
      try {
        await leadService.remove(id);
        toast.success("Lead deleted.");
        await Promise.all([refreshLeads(), refreshStats()]);
        return { ok: true };
      } catch (err) {
        toast.error(parseApiErrors(err).form || "Could not delete the lead.");
        return { ok: false };
      }
    },
    [refreshLeads, refreshStats, toast]
  );

  const clearFilters = useCallback(() => {
    setSearch("");
    setStatus("");
    setPage(1);
  }, []);

  const setSearchAndResetPage = useCallback((value) => {
    setSearch(value);
    setPage(1);
  }, []);

  const setStatusAndResetPage = useCallback((value) => {
    setStatus(value);
    setPage(1);
  }, []);

  return {
    leads,
    stats,
    search,
    setSearch: setSearchAndResetPage,
    status,
    setStatus: setStatusAndResetPage,
    debouncedSearch,
    loading,
    refreshing,
    statsLoading,
    error,
    hasActiveFilters: Boolean(search.trim() || status),
    page,
    setPage,
    pagination,
    pageSize: 10,
    clearFilters,
    refreshLeads,
    refreshStats,
    createLead,
    updateLead,
    removeLead,
  };
}
