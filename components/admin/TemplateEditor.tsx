"use client";

import { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import type { Editor as TinyMceEditor } from "tinymce";
import Icon from "@/components/Icon";
import { renderMergeTags } from "@/lib/mergeTags";
import type { StoredAuth } from "@/lib/authClient";

const MERGE_TAGS = [
  { label: "First name", tag: "{{first_name|there}}" },
  { label: "Email", tag: "{{email}}" },
  { label: "Booking link", tag: "{{booking_link}}" },
  { label: "Unsubscribe link", tag: "{{unsubscribe_link}}" },
  { label: "Site URL", tag: "{{site_url}}" },
];

const SAMPLE_MERGE_DATA = {
  first_name: "Jordan",
  email: "jordan@example.com",
  booking_link: "https://myidocusa.janeapp.com/",
  unsubscribe_link: "#",
  site_url: "https://www.myidocusa.com",
};

type Props = {
  auth: StoredAuth;
  subject: string;
  onSubjectChange: (v: string) => void;
  previewText: string;
  onPreviewTextChange: (v: string) => void;
  htmlBody: string;
  onHtmlBodyChange: (v: string) => void;
  plainTextBody: string;
  onPlainTextBodyChange: (v: string) => void;
  onSendTest: (to: string) => Promise<void>;
};

export default function TemplateEditor({
  auth,
  subject,
  onSubjectChange,
  previewText,
  onPreviewTextChange,
  htmlBody,
  onHtmlBodyChange,
  plainTextBody,
  onPlainTextBodyChange,
  onSendTest,
}: Props) {
  const editorRef = useRef<TinyMceEditor | null>(null);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [testEmail, setTestEmail] = useState(auth.email);
  const [testStatus, setTestStatus] = useState("");

  function insertTag(tag: string) {
    editorRef.current?.insertContent(tag);
  }

  async function handleSendTest() {
    setTestStatus("Sending…");
    try {
      await onSendTest(testEmail);
      setTestStatus("Test email sent!");
    } catch (err) {
      setTestStatus(err instanceof Error ? err.message : "Failed to send test email");
    }
  }

  const apiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY;
  const previewHtml = renderMergeTags(htmlBody, SAMPLE_MERGE_DATA);

  return (
    <div className="template-editor">
      <div className="form-group">
        <label className="form-label" htmlFor="te-subject">Subject line</label>
        <input id="te-subject" className="form-input" value={subject} onChange={(e) => onSubjectChange(e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="te-preview">Preview text</label>
        <input
          id="te-preview"
          className="form-input"
          value={previewText}
          onChange={(e) => onPreviewTextChange(e.target.value)}
          placeholder="Shown next to the subject line in most inboxes"
        />
      </div>

      <div className="form-group">
        <div className="merge-tag-bar">
          <span className="merge-tag-bar__label">Insert:</span>
          {MERGE_TAGS.map((m) => (
            <button key={m.tag} type="button" className="merge-tag-chip" onClick={() => insertTag(m.tag)}>
              {m.label}
            </button>
          ))}
        </div>
        <Editor
          apiKey={apiKey}
          value={htmlBody}
          onEditorChange={onHtmlBodyChange}
          onInit={(_evt, editor) => {
            editorRef.current = editor;
          }}
          init={{
            height: 420,
            menubar: false,
            plugins: ["link", "lists", "image", "code", "table"],
            toolbar:
              "undo redo | formatselect | bold italic underline | forecolor | alignleft aligncenter alignright | bullist numlist | link image table | code",
            images_upload_handler: async (blobInfo: { blob: () => Blob; filename: () => string }) => {
              const formData = new FormData();
              formData.append("file", blobInfo.blob(), blobInfo.filename());
              const res = await fetch("/api/admin/upload-image", {
                method: "POST",
                headers: { Authorization: `Bearer ${auth.token}` },
                body: formData,
              });
              const data = await res.json();
              if (!res.ok) throw new Error(data.error || "Image upload failed");
              return data.location;
            },
          }}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="te-text">Plain-text version (optional — auto-generated if left blank)</label>
        <textarea
          id="te-text"
          className="form-input"
          rows={4}
          value={plainTextBody}
          onChange={(e) => onPlainTextBodyChange(e.target.value)}
        />
      </div>

      <div className="dash__panel" style={{ marginTop: 28 }}>
        <div className="dash__panel-head">
          <h2>Live Preview</h2>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              className={`btn btn--outline-light${previewDevice === "desktop" ? " is-active" : ""}`}
              style={{ color: "var(--text)", borderColor: "var(--border)" }}
              onClick={() => setPreviewDevice("desktop")}
            >
              Desktop
            </button>
            <button
              type="button"
              className={`btn btn--outline-light${previewDevice === "mobile" ? " is-active" : ""}`}
              style={{ color: "var(--text)", borderColor: "var(--border)" }}
              onClick={() => setPreviewDevice("mobile")}
            >
              Mobile
            </button>
          </div>
        </div>
        <div className="email-preview-frame">
          <iframe
            title="Email preview"
            srcDoc={previewHtml}
            className={previewDevice === "mobile" ? "email-preview-frame__iframe is-mobile" : "email-preview-frame__iframe"}
          />
        </div>
      </div>

      <div className="dash__panel" style={{ marginTop: 20 }}>
        <div className="dash__panel-head">
          <h2>Send Test Email</h2>
        </div>
        <div style={{ padding: 24, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <input
            className="form-input"
            style={{ maxWidth: 280 }}
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
          />
          <button type="button" className="btn btn--primary" onClick={handleSendTest}>
            <Icon name="send" size={15} style={{ marginRight: 6, verticalAlign: "-2px" }} />
            Send Test
          </button>
          <span className="muted">{testStatus}</span>
        </div>
      </div>
    </div>
  );
}
