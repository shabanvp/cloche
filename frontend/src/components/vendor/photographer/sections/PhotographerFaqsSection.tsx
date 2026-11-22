"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, CheckCircle2, Edit2, HelpCircle, Plus, Trash2 } from "lucide-react";
import type { CustomerQuestionItem, PhotographerFaqItem } from "../types";
import { formatShortDate } from "../types";

interface Props {
  photographerFaqs: PhotographerFaqItem[];
  customerQuestions: CustomerQuestionItem[];
  onRefresh: () => Promise<void>;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export function PhotographerFaqsSection({
  photographerFaqs,
  customerQuestions,
  onRefresh,
  showToast,
}: Props) {
  const [subTab, setSubTab] = useState<"customer_questions" | "studio_faqs">(
    customerQuestions.some((q) => q.status === "pending") ? "customer_questions" : "studio_faqs"
  );

  // Studio FAQ form
  const [editingFaq, setEditingFaq] = useState<PhotographerFaqItem | null>(null);
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");
  const [faqPublished, setFaqPublished] = useState(true);
  const [savingFaq, setSavingFaq] = useState(false);

  // Customer question moderation
  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const handleSaveStudioFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQuestion.trim() || !faqAnswer.trim()) {
      showToast("Question and answer are required", "error");
      return;
    }
    setSavingFaq(true);
    try {
      const res = await fetch("/api/vendor/photographer/faqs", {
        method: editingFaq ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...(editingFaq ? { id: editingFaq.id } : {}),
          question: faqQuestion.trim(),
          answer: faqAnswer.trim(),
          isPublished: faqPublished,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to save FAQ");
      setEditingFaq(null);
      setFaqQuestion("");
      setFaqAnswer("");
      await onRefresh();
      showToast(editingFaq ? "FAQ updated" : "FAQ added", "success");
    } catch (err: any) {
      showToast(err?.message || "Failed to save FAQ", "error");
    } finally {
      setSavingFaq(false);
    }
  };

  const handleToggleFaqPublish = async (faq: PhotographerFaqItem) => {
    try {
      await fetch("/api/vendor/photographer/faqs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: faq.id, isPublished: !faq.isPublished }),
      });
      await onRefresh();
      showToast(faq.isPublished ? "Moved to Draft" : "FAQ Published live", "success");
    } catch {
      showToast("Update failed", "error");
    }
  };

  const handleReorderFaq = async (index: number, dir: -1 | 1) => {
    const nextIdx = index + dir;
    if (nextIdx < 0 || nextIdx >= photographerFaqs.length) return;
    const copy = [...photographerFaqs];
    const [item] = copy.splice(index, 1);
    copy.splice(nextIdx, 0, item);

    await fetch("/api/vendor/photographer/faqs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ orderedIds: copy.map((f) => f.id) }),
    });
    await onRefresh();
  };

  const handleDeleteFaq = async (id: string) => {
    await fetch(`/api/vendor/photographer/faqs?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
      credentials: "include",
    });
    await onRefresh();
    showToast("FAQ deleted", "success");
  };

  const handleCustomerAction = async (
    questionId: string,
    action: "publish" | "draft" | "reject" | "delete",
    answer?: string
  ) => {
    setBusyId(questionId);
    try {
      const res = await fetch("/api/vendor/photographer/faqs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ questionId, action, answer }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Action failed");
      setAnsweringId(null);
      setAnswerText("");
      await onRefresh();
      showToast(
        action === "publish"
          ? "Answered & published to public FAQ accordion"
          : action === "draft"
            ? "Saved response as Draft"
            : action === "reject"
              ? "Question rejected"
              : "Customer question deleted",
        "success"
      );
    } catch (err: any) {
      showToast(err?.message || "Failed to moderate question", "error");
    } finally {
      setBusyId(null);
    }
  };

  const pendingCount = customerQuestions.filter((q) => q.status === "pending").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-[#2B2523]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-[#7A6F67] mt-0.5">
            Moderate incoming client questions and curate published FAQs on your profile
          </p>
        </div>

        <div className="inline-flex rounded-xl border border-[#E6DDD0] bg-white p-1">
          <button
            type="button"
            onClick={() => setSubTab("customer_questions")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold ${
              subTab === "customer_questions" ? "bg-[#2B2523] text-white" : "text-[#5E544D]"
            }`}
          >
            Customer Questions
            {pendingCount > 0 && (
              <span className="rounded-full bg-[#C8A96A] px-1.5 py-0.5 text-[10px] font-bold text-white">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setSubTab("studio_faqs")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold ${
              subTab === "studio_faqs" ? "bg-[#2B2523] text-white" : "text-[#5E544D]"
            }`}
          >
            Studio FAQs ({photographerFaqs.length})
          </button>
        </div>
      </div>

      {/* SUB-TAB A: CUSTOMER QUESTIONS */}
      {subTab === "customer_questions" && (
        <div className="space-y-4">
          {customerQuestions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#DED4C6] bg-white p-10 text-center">
              <HelpCircle className="w-8 h-8 mx-auto text-[#C8A96A] mb-2" />
              <p className="text-sm font-medium text-[#2B2523]">No customer questions submitted yet</p>
              <p className="text-xs text-[#7A6F67] mt-1">
                Couples can ask questions directly from your public Photographer profile FAQ section.
              </p>
            </div>
          ) : (
            customerQuestions.map((cq) => (
              <div key={cq.id} className="rounded-2xl border border-[#E6DDD0] bg-white p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-semibold text-xs text-[#2B2523]">{cq.customerName}</span>
                    {cq.customerEmail && (
                      <span className="text-xs text-[#7A6F67] ml-2">({cq.customerEmail})</span>
                    )}
                    <span className="text-[11px] text-[#7A6F67] ml-2">
                      · {formatShortDate(cq.createdAt)}
                    </span>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${
                      cq.status === "published"
                        ? "bg-[#0F4C45]/10 text-[#0F4C45]"
                        : cq.status === "pending"
                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                          : cq.status === "draft"
                            ? "bg-stone-100 text-stone-700"
                            : "bg-red-50 text-red-700"
                    }`}
                  >
                    {cq.status}
                  </span>
                </div>

                <p className="font-medium text-sm text-[#2B2523]">Q: {cq.question}</p>

                {cq.answer && answeringId !== cq.id && (
                  <p className="rounded-xl bg-[#FAF7F2] p-3 text-xs text-[#4A3F3A] border border-[#EDE6DA]">
                    A: {cq.answer}
                  </p>
                )}

                {answeringId === cq.id ? (
                  <div className="space-y-2.5 pt-1">
                    <textarea
                      rows={3}
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      placeholder="Write your clear answer..."
                      className="w-full rounded-xl border border-[#E6DDD0] p-3 text-xs text-[#2B2523]"
                    />
                    <div className="flex flex-wrap gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setAnsweringId(null)}
                        className="px-3 py-1.5 text-xs text-[#7A6F67]"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={busyId === cq.id}
                        onClick={() => handleCustomerAction(cq.id, "draft", answerText)}
                        className="rounded-xl border border-[#E6DDD0] bg-[#FAF7F2] px-3.5 py-1.5 text-xs font-semibold text-[#2B2523]"
                      >
                        Save Draft
                      </button>
                      <button
                        type="button"
                        disabled={busyId === cq.id}
                        onClick={() => handleCustomerAction(cq.id, "publish", answerText)}
                        className="inline-flex items-center gap-1 rounded-xl bg-[#0F4C45] px-4 py-1.5 text-xs font-semibold text-white"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Answer & Publish
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#F0EAE0] text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setAnsweringId(cq.id);
                        setAnswerText(cq.answer || "");
                      }}
                      className="font-semibold text-[#0F4C45] hover:underline"
                    >
                      {cq.answer ? "Edit & Publish" : "Write Answer"}
                    </button>
                    {cq.status !== "rejected" && (
                      <button
                        type="button"
                        onClick={() => handleCustomerAction(cq.id, "reject")}
                        className="font-medium text-amber-700 hover:underline"
                      >
                        Reject
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleCustomerAction(cq.id, "delete")}
                      className="font-medium text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* SUB-TAB B: PHOTOGRAPHER FAQS */}
      {subTab === "studio_faqs" && (
        <div className="space-y-5">
          <form
            onSubmit={handleSaveStudioFaq}
            className="rounded-2xl border border-[#E6DDD0] bg-white p-5 space-y-3.5"
          >
            <h3 className="font-serif text-lg font-semibold text-[#2B2523] flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#0F4C45]" />
              {editingFaq ? "Edit Studio FAQ" : "Add Frequently Asked Question"}
            </h3>
            <input
              type="text"
              required
              value={faqQuestion}
              onChange={(e) => setFaqQuestion(e.target.value)}
              placeholder="Question (e.g., How many edited photos do you deliver for a wedding?)"
              className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-sm text-[#2B2523]"
            />
            <textarea
              rows={3}
              required
              value={faqAnswer}
              onChange={(e) => setFaqAnswer(e.target.value)}
              placeholder="Clear, helpful studio answer..."
              className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-sm text-[#2B2523]"
            />
            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-xs font-medium text-[#2B2523]">
                <input
                  type="checkbox"
                  checked={faqPublished}
                  onChange={(e) => setFaqPublished(e.target.checked)}
                  className="accent-[#0F4C45]"
                />
                Publish immediately to public storefront
              </label>
              <div className="flex gap-2">
                {editingFaq && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingFaq(null);
                      setFaqQuestion("");
                      setFaqAnswer("");
                    }}
                    className="px-3 py-2 text-xs text-[#7A6F67]"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={savingFaq}
                  className="rounded-xl bg-[#0F4C45] px-5 py-2 text-xs font-semibold text-white"
                >
                  {savingFaq ? "Saving..." : editingFaq ? "Update FAQ" : "Save FAQ"}
                </button>
              </div>
            </div>
          </form>

          <div className="space-y-3">
            {photographerFaqs.map((faq, idx) => (
              <div key={faq.id} className="rounded-2xl border border-[#E6DDD0] bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          faq.isPublished
                            ? "bg-[#0F4C45]/10 text-[#0F4C45]"
                            : "bg-stone-100 text-stone-600"
                        }`}
                      >
                        {faq.isPublished ? "Published" : "Draft"}
                      </span>
                      <h4 className="font-semibold text-sm text-[#2B2523]">{faq.question}</h4>
                    </div>
                    <p className="text-xs text-[#5E544D] leading-relaxed">{faq.answer}</p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleReorderFaq(idx, -1)}
                      className="p-1.5 rounded-lg border border-[#E6DDD0] disabled:opacity-35"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === photographerFaqs.length - 1}
                      onClick={() => handleReorderFaq(idx, 1)}
                      className="p-1.5 rounded-lg border border-[#E6DDD0] disabled:opacity-35"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleFaqPublish(faq)}
                      className="px-2.5 py-1.5 rounded-lg border border-[#E6DDD0] text-[11px] font-medium text-[#0F4C45]"
                    >
                      {faq.isPublished ? "Draft" : "Publish"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingFaq(faq);
                        setFaqQuestion(faq.question);
                        setFaqAnswer(faq.answer);
                        setFaqPublished(faq.isPublished);
                      }}
                      className="p-1.5 rounded-lg border border-[#E6DDD0] text-[#5E544D]"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteFaq(faq.id)}
                      className="p-1.5 rounded-lg border border-[#E6DDD0] text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

