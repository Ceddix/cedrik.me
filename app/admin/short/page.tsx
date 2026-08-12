"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TbLink,
  TbCopy,
  TbCheck,
  TbExternalLink,
  TbTrash,
  TbEdit,
  TbPlus,
  TbSearch,
  TbDownload,
  TbRefresh,
  TbLock,
  TbKey,
  TbEye,
  TbDice5,
  TbLogout,
} from "react-icons/tb";

interface ShortLink {
  id: number;
  alias: string;
  target: string;
  visit_count: number;
  created_at?: string;
}

export default function AdminShortPage() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  // Secret login state
  const [secretKeyInput, setSecretKeyInput] = useState("");
  const [secretError, setSecretError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  // Links data & pagination
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [fetchingLinks, setFetchingLinks] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFilteredLinks, setTotalFilteredLinks] = useState(0);
  const [stats, setStats] = useState<{
    totalLinks: number;
    totalClicks: number;
    topLink: { alias: string; visit_count: number } | null;
  }>({
    totalLinks: 0,
    totalClicks: 0,
    topLink: null,
  });

  // Create Form State
  const [targetUrl, setTargetUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [copiedId, setCopiedId] = useState<number | string | null>(null);

  // Modals state
  const [editingLink, setEditingLink] = useState<ShortLink | null>(null);
  const [editTarget, setEditTarget] = useState("");
  const [editAlias, setEditAlias] = useState("");
  const [editError, setEditError] = useState("");
  const [updating, setUpdating] = useState(false);

  const [deletingLink, setDeletingLink] = useState<ShortLink | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [showShareXModal, setShowShareXModal] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Check Auth Status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Search debounce effect
  useEffect(() => {
    if (!authenticated) return;
    const timer = setTimeout(() => {
      fetchLinks(1, searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const checkAuth = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setAuthenticated(data.authenticated);
      if (data.authenticated) {
        fetchLinks(1, "");
      }
    } catch {
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // 2. Secret Key Login
  const handleSecretLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretKeyInput.trim()) return;

    setLoggingIn(true);
    setSecretError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: secretKeyInput }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAuthenticated(true);
        showToast("Logged in successfully!");
        fetchLinks(1, "");
      } else {
        setSecretError(data.error || "Invalid secret key.");
      }
    } catch {
      setSecretError("Connection error.");
    } finally {
      setLoggingIn(false);
    }
  };

  // 3. Logout
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setAuthenticated(false);
    setLinks([]);
    showToast("Logged out");
  };

  // 4. Fetch Links with Pagination & Search
  const fetchLinks = async (page = currentPage, query = searchQuery) => {
    setFetchingLinks(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "25",
        q: query,
      });
      const res = await fetch(`/api/admin/short?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLinks(data.links || []);
        if (data.pagination) {
          setCurrentPage(data.pagination.page);
          setTotalPages(data.pagination.totalPages);
          setTotalFilteredLinks(data.pagination.totalLinks);
        }
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error("Failed to fetch links", err);
    } finally {
      setFetchingLinks(false);
    }
  };

  // 5. Generate Random Alias
  const generateRandomAlias = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let res = "";
    for (let i = 0; i < 6; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCustomAlias(res);
  };

  // 6. Create New Link
  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl.trim()) {
      setCreateError("Destination URL is required.");
      return;
    }

    setCreating(true);
    setCreateError("");

    try {
      const res = await fetch("/api/admin/short", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target: targetUrl,
          alias: customAlias,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setCreateError(data.error || "Failed to create short link.");
      } else {
        const origin = typeof window !== "undefined" ? window.location.origin : "https://cedrik.me";
        const shortUrl = `${origin}/s/${data.link.alias}`;
        try {
          navigator.clipboard.writeText(shortUrl);
          setCopiedId(data.link.id);
        } catch {}
        showToast(`Created & copied: /s/${data.link.alias}`);
        setTargetUrl("");
        setCustomAlias("");
        fetchLinks();
      }
    } catch {
      setCreateError("Network error while creating link.");
    } finally {
      setCreating(false);
    }
  };

  // 7. Update Link
  const handleUpdateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink) return;

    setUpdating(true);
    setEditError("");

    try {
      const res = await fetch(`/api/admin/short/${editingLink.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target: editTarget,
          alias: editAlias,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setEditError(data.error || "Failed to update link.");
      } else {
        showToast("Link updated successfully!");
        setEditingLink(null);
        fetchLinks();
      }
    } catch {
      setEditError("Error updating link.");
    } finally {
      setUpdating(false);
    }
  };

  // 8. Delete Link
  const handleDeleteLink = async () => {
    if (!deletingLink) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/short/${deletingLink.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        showToast(`Deleted /s/${deletingLink.alias}`);
        setDeletingLink(null);
        fetchLinks();
      } else {
        showToast("Failed to delete link.");
      }
    } catch {
      showToast("Network error deleting link.");
    } finally {
      setDeleting(false);
    }
  };

  // 9. Copy to Clipboard
  const copyShortUrl = (alias: string, id: number | string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://cedrik.me";
    const url = `${origin}/s/${alias}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const currentDomain = typeof window !== "undefined" ? window.location.host : "cedrik.me";

  if (loading) {
    return (
      <div className="min-h-screen text-zinc-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-zinc-400">Loading Shortener Dashboard...</p>
        </div>
      </div>
    );
  }

  // --- LOGIN SCREEN ---
  if (!authenticated) {
    return (
      <>
        <title>URL Shortener | Cedrik Secic</title>
        <div className="min-h-screen text-zinc-100 flex flex-col items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm bg-neutral-800/40 border border-gray-300/20 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
          >
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/20 shadow-inner">
                <TbLock className="text-2xl" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-100">URL Shortener</h1>
              <p className="text-sm text-zinc-400">
                Enter secret key to manage <span className="text-emerald-400 font-mono">{currentDomain}</span>
              </p>
            </div>

            <form onSubmit={handleSecretLogin} className="space-y-4 pt-2">
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <TbKey />
                  </div>
                  <input
                    type="password"
                    value={secretKeyInput}
                    onChange={(e) => setSecretKeyInput(e.target.value)}
                    placeholder="Enter Secret Key"
                    className="w-full bg-zinc-950/60 border border-zinc-700/60 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-zinc-100 placeholder-zinc-500 text-sm rounded-2xl pl-10 pr-4 py-2.5 outline-none transition-all font-mono"
                  />
                </div>
                {secretError && <p className="text-xs text-rose-400 mt-1.5">{secretError}</p>}
              </div>

              <button
                type="submit"
                disabled={loggingIn}
                className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-zinc-950 font-bold text-sm py-2.5 px-4 rounded-2xl transition-all shadow-lg hover:shadow-emerald-500/20 disabled:opacity-50"
              >
                {loggingIn ? "Authenticating..." : "Unlock Dashboard"}
              </button>
            </form>
          </motion.div>
        </div>
      </>
    );
  }

  // --- DASHBOARD ---
  return (
    <>
      <title>URL Shortener | Cedrik Secic</title>
      <div className="min-h-screen text-zinc-100 selection:bg-emerald-500/30 selection:text-emerald-300">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-neutral-800/40 border border-gray-300/20 rounded-3xl p-5 backdrop-blur-2xl shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center border border-emerald-500/20 shadow-inner">
                <TbLink className="text-2xl" />
              </div>
              <div>
                <h1 className="font-bold text-xl leading-tight text-zinc-100 flex items-center gap-2">
                  URL Shortener
                </h1>
                <p className="text-xs text-zinc-400 font-mono">
                  {currentDomain}/s/*
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                onClick={() => setShowShareXModal(true)}
                className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium py-2.5 px-4 rounded-2xl transition-all shadow-sm"
              >
                <TbDownload className="text-base" />
                <span>ShareX Config (.sxcu)</span>
              </button>

              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 border border-zinc-700/50 rounded-2xl transition-all"
              >
                <TbLogout className="text-lg" />
              </button>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-neutral-800/30 border border-gray-300/10 rounded-2xl p-5 backdrop-blur-xl shadow-xl">
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">Total Short Links</p>
              <p className="text-3xl font-extrabold text-zinc-100 font-mono">{stats.totalLinks}</p>
            </div>

            <div className="bg-neutral-800/30 border border-gray-300/10 rounded-2xl p-5 backdrop-blur-xl shadow-xl">
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">Total Visits / Clicks</p>
              <p className="text-3xl font-extrabold text-emerald-400 font-mono">{stats.totalClicks.toLocaleString()}</p>
            </div>

            <div className="bg-neutral-800/30 border border-gray-300/10 rounded-2xl p-5 backdrop-blur-xl shadow-xl">
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">Most Clicked Link</p>
              {stats.topLink ? (
                <div className="flex items-center justify-between gap-2 mt-1">
                  <span className="text-lg font-bold text-zinc-200 font-mono truncate">/s/{stats.topLink.alias}</span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    {stats.topLink.visit_count} clicks
                  </span>
                </div>
              ) : (
                <p className="text-sm text-zinc-500 italic mt-1">No links created yet</p>
              )}
            </div>
          </div>

          {/* Create Link Card */}
          <div className="bg-neutral-800/40 border border-gray-300/20 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl">
            <h2 className="text-lg font-bold text-zinc-100 mb-4 flex items-center gap-2">
              <TbPlus className="text-emerald-400 text-xl" />
              Create Shortened URL
            </h2>

            <form onSubmit={handleCreateLink} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Destination URL */}
                <div className="md:col-span-7">
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Destination URL</label>
                  <input
                    type="text"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="https://example.com/very-long-link-path"
                    className="w-full bg-zinc-950/60 border border-zinc-700/60 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-zinc-100 placeholder-zinc-500 text-sm rounded-2xl px-3.5 py-2.5 outline-none transition-all"
                  />
                </div>

                {/* Custom Alias */}
                <div className="md:col-span-5">
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5 flex justify-between">
                    <span>Slug / Alias (Optional)</span>
                    <button
                      type="button"
                      onClick={generateRandomAlias}
                      className="text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <TbDice5 /> Random
                    </button>
                  </label>
                  <div className="flex gap-2">
                    <div className="relative w-full">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 text-xs font-mono select-none">
                        /s/
                      </span>
                      <input
                        type="text"
                        value={customAlias}
                        onChange={(e) => setCustomAlias(e.target.value)}
                        placeholder="custom-slug"
                        className="w-full bg-zinc-950/60 border border-zinc-700/60 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-zinc-100 placeholder-zinc-500 text-sm rounded-2xl pl-9 pr-3.5 py-2.5 font-mono outline-none transition-all"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={creating}
                      className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-zinc-950 font-bold text-sm px-5 py-2.5 rounded-2xl transition-all flex items-center justify-center gap-2 flex-shrink-0 disabled:opacity-50"
                    >
                      {creating ? "Creating..." : "Shorten"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Live Preview */}
              {customAlias && (
                <div className="text-xs text-zinc-400 flex items-center gap-2 font-mono bg-zinc-950/40 p-2.5 rounded-2xl border border-zinc-800/60">
                  <span className="text-zinc-500">Live Short URL Preview:</span>
                  <span className="text-emerald-400 font-semibold">{currentDomain}/s/{customAlias}</span>
                </div>
              )}

              {createError && <p className="text-xs text-rose-400">{createError}</p>}
            </form>
          </div>

          {/* Links Table Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                Existing Short Links ({totalFilteredLinks})
              </h2>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-base" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search slug or destination..."
                    className="w-full bg-zinc-900/60 border border-zinc-700/60 text-xs rounded-2xl pl-9 pr-3 py-2 text-zinc-200 placeholder-zinc-500 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>

                <button
                  onClick={() => fetchLinks(currentPage, searchQuery)}
                  title="Refresh links"
                  className="p-2 bg-zinc-900/60 border border-zinc-700/60 text-zinc-400 hover:text-zinc-100 rounded-2xl transition-all"
                >
                  <TbRefresh className={`text-base ${fetchingLinks ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>

            {links.length === 0 ? (
              <div className="bg-neutral-800/30 border border-gray-300/10 rounded-3xl p-12 text-center text-zinc-500 backdrop-blur-xl">
                <TbLink className="text-4xl mx-auto mb-2 text-zinc-600" />
                <p className="text-sm">No shortened links found.</p>
              </div>
            ) : (
              <div className="bg-neutral-800/40 border border-gray-300/20 rounded-3xl overflow-hidden backdrop-blur-2xl shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-zinc-300">
                    <thead className="bg-zinc-950/60 border-b border-zinc-800/80 text-xs uppercase text-zinc-400 font-mono">
                      <tr>
                        <th className="py-3.5 px-4 font-semibold">Short Link (Alias)</th>
                        <th className="py-3.5 px-4 font-semibold">Destination Target</th>
                        <th className="py-3.5 px-4 font-semibold text-center">Visits</th>
                        <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {links.map((link) => (
                        <tr key={link.id} className="hover:bg-zinc-800/40 transition-colors">
                          {/* Alias */}
                          <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span>/s/{link.alias}</span>
                              <button
                                onClick={() => copyShortUrl(link.alias, link.id)}
                                title="Copy short link"
                                className="text-zinc-500 hover:text-zinc-200 transition-colors"
                              >
                                {copiedId === link.id ? (
                                  <TbCheck className="text-emerald-400" />
                                ) : (
                                  <TbCopy />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Target */}
                          <td className="py-3.5 px-4 max-w-xs md:max-w-md truncate">
                            <a
                              href={link.target}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-zinc-300 hover:text-white hover:underline flex items-center gap-1.5 truncate"
                            >
                              <span className="truncate">{link.target}</span>
                              <TbExternalLink className="text-zinc-500 flex-shrink-0 text-xs" />
                            </a>
                          </td>

                          {/* Visit Count */}
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 bg-zinc-800/80 px-2.5 py-1 rounded-full text-xs font-mono font-medium text-zinc-300">
                              <TbEye className="text-zinc-500" />
                              {link.visit_count || 0}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1">
                            <button
                              onClick={() => {
                                setEditingLink(link);
                                setEditTarget(link.target);
                                setEditAlias(link.alias);
                              }}
                              className="p-1.5 text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800 rounded-xl transition-all"
                              title="Edit Link"
                            >
                              <TbEdit className="text-lg" />
                            </button>
                            <button
                              onClick={() => setDeletingLink(link)}
                              className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded-xl transition-all"
                              title="Delete Link"
                            >
                              <TbTrash className="text-lg" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Bar */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-zinc-950/60 border-t border-zinc-800/80 text-xs text-zinc-400">
                    <div>
                      Showing <span className="font-mono text-zinc-200">{(currentPage - 1) * 25 + 1}</span> to{" "}
                      <span className="font-mono text-zinc-200">{Math.min(currentPage * 25, totalFilteredLinks)}</span> of{" "}
                      <span className="font-mono text-zinc-200">{totalFilteredLinks}</span> links
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => fetchLinks(currentPage - 1, searchQuery)}
                        disabled={currentPage <= 1 || fetchingLinks}
                        className="px-3 py-1.5 bg-zinc-900/80 border border-zinc-700/60 rounded-xl hover:bg-zinc-800 disabled:opacity-40 font-medium transition-all"
                      >
                        Previous
                      </button>
                      <span className="font-mono text-zinc-300 px-2">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => fetchLinks(currentPage + 1, searchQuery)}
                        disabled={currentPage >= totalPages || fetchingLinks}
                        className="px-3 py-1.5 bg-zinc-900/80 border border-zinc-700/60 rounded-xl hover:bg-zinc-800 disabled:opacity-40 font-medium transition-all"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        {/* --- EDIT MODAL --- */}
        <AnimatePresence>
          {editingLink && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-md">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-neutral-900/90 border border-zinc-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 backdrop-blur-2xl"
              >
                <h3 className="text-lg font-bold text-zinc-100">Edit Short Link</h3>
                <form onSubmit={handleUpdateLink} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Slug / Alias</label>
                    <input
                      type="text"
                      value={editAlias}
                      onChange={(e) => setEditAlias(e.target.value)}
                      className="w-full bg-zinc-950/80 border border-zinc-800 text-zinc-100 text-sm rounded-2xl px-3 py-2 outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Destination Target</label>
                    <input
                      type="text"
                      value={editTarget}
                      onChange={(e) => setEditTarget(e.target.value)}
                      className="w-full bg-zinc-950/80 border border-zinc-800 text-zinc-100 text-sm rounded-2xl px-3 py-2 outline-none focus:border-emerald-500"
                    />
                  </div>
                  {editError && <p className="text-xs text-rose-400">{editError}</p>}
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingLink(null)}
                      className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 rounded-2xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updating}
                      className="px-4 py-2 text-xs font-bold bg-emerald-500 text-zinc-950 rounded-2xl hover:bg-emerald-600 disabled:opacity-50"
                    >
                      {updating ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* --- DELETE CONFIRM MODAL --- */}
        <AnimatePresence>
          {deletingLink && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-md">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-neutral-900/90 border border-zinc-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 backdrop-blur-2xl"
              >
                <h3 className="text-lg font-bold text-zinc-100">Delete Link?</h3>
                <p className="text-xs text-zinc-400">
                  Are you sure you want to delete <span className="font-mono text-emerald-400 font-bold">/s/{deletingLink.alias}</span>? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setDeletingLink(null)}
                    className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 rounded-2xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteLink}
                    disabled={deleting}
                    className="px-4 py-2 text-xs font-bold bg-rose-500 text-white rounded-2xl hover:bg-rose-600 disabled:opacity-50"
                  >
                    {deleting ? "Deleting..." : "Delete Permanently"}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* --- SHAREX CONFIG MODAL --- */}
        <AnimatePresence>
          {showShareXModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-md">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-neutral-900/90 border border-zinc-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 backdrop-blur-2xl"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                    <TbDownload className="text-emerald-400" />
                    ShareX Setup Guide
                  </h3>
                  <button
                    onClick={() => setShowShareXModal(false)}
                    className="text-zinc-500 hover:text-zinc-300 text-sm"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 text-xs text-zinc-300">
                  <p>
                    Integrate your custom shortener into ShareX for 1-click clipboard link shortening:
                  </p>

                  <ol className="list-decimal list-inside space-y-2 bg-zinc-950/60 p-3.5 rounded-2xl border border-zinc-800/80 font-mono text-[11px] text-zinc-400">
                    <li>Click below to download <code className="text-emerald-400">cedrik.me-shortener.sxcu</code>.</li>
                    <li>Double-click the downloaded file and click <strong>Yes</strong> to set as active URL shortener.</li>
                    <li>Copy any long URL to clipboard, then in ShareX go to <strong>Upload &rarr; Shorten URL</strong> (or press ShareX Shorten hotkey).</li>
                    <li>ShareX will shorten it and place <code className="text-emerald-400">{currentDomain}/s/...</code> straight into your clipboard!</li>
                  </ol>
                </div>

                <div className="pt-2">
                  <a
                    href="/api/sharex/config"
                    download
                    onClick={() => setShowShareXModal(false)}
                    className="w-full py-2.5 px-4 text-xs font-bold bg-emerald-500 text-zinc-950 rounded-2xl hover:bg-emerald-600 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg text-center"
                  >
                    <TbDownload className="text-base" />
                    Download ShareX Config (.sxcu)
                  </a>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* --- TOAST FEEDBACK --- */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-6 right-6 z-50 bg-zinc-800/90 border border-zinc-700/80 text-zinc-100 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-medium backdrop-blur-xl"
            >
              <TbCheck className="text-emerald-400 text-base" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
