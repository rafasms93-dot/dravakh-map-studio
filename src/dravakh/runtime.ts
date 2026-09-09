type SaveMethod = "storage" | "machine" | "dropbox";

type StudioSaveService = {
  saveMap: (method: SaveMethod) => Promise<void>;
};

type StudioWindow = Window & {
  Services?: {
    Save?: StudioSaveService;
  };
};

const LAST_BACKUP_KEY = "dravakh:last-durable-map-backup";
const PANEL_ID = "dravakh-map-studio-status";

let dirty = false;
let lastBackupAt = Number(localStorage.getItem(LAST_BACKUP_KEY) || 0);

function getSaveService(): StudioSaveService | undefined {
  return (window as StudioWindow).Services?.Save;
}

function formatTime(timestamp: number): string {
  if (!timestamp) return "nenhum nesta sessão";
  return new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(timestamp);
}

function createStudioPanel(): { panel: HTMLDivElement; status: HTMLSpanElement; backupButton: HTMLButtonElement } {
  const panel = document.createElement("div");
  panel.id = PANEL_ID;
  panel.setAttribute("role", "status");
  Object.assign(panel.style, {
    position: "fixed",
    left: "12px",
    bottom: "12px",
    zIndex: "100000",
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: "4px 10px",
    alignItems: "center",
    maxWidth: "360px",
    padding: "9px 10px",
    border: "1px solid rgba(201, 162, 39, 0.55)",
    borderRadius: "7px",
    background: "rgba(13, 11, 10, 0.92)",
    color: "#ede3cb",
    fontFamily: "Arial, sans-serif",
    fontSize: "11px",
    lineHeight: "1.25",
    boxShadow: "0 4px 18px rgba(0, 0, 0, 0.35)"
  });

  const title = document.createElement("strong");
  title.textContent = "Dravakh Map Studio";
  title.style.color = "#e8c766";

  const backupButton = document.createElement("button");
  backupButton.type = "button";
  backupButton.textContent = "Baixar backup .map";
  Object.assign(backupButton.style, {
    gridRow: "1 / span 2",
    gridColumn: "2",
    padding: "6px 8px",
    border: "1px solid #8a6a2e",
    borderRadius: "5px",
    background: "#1a1714",
    color: "#ede3cb",
    cursor: "pointer",
    fontSize: "11px"
  });

  const status = document.createElement("span");
  status.style.opacity = "0.84";

  const attribution = document.createElement("a");
  attribution.href = "https://github.com/Azgaar/Fantasy-Map-Generator";
  attribution.target = "_blank";
  attribution.rel = "noopener noreferrer";
  attribution.textContent = "Azgaar FMG · MIT";
  Object.assign(attribution.style, {
    color: "#bcae8a",
    textDecoration: "none",
    fontSize: "10px"
  });

  const left = document.createElement("div");
  left.style.display = "grid";
  left.style.gap = "2px";
  left.append(title, status, attribution);
  panel.append(left, backupButton);

  return { panel, status, backupButton };
}

function installRuntime(): void {
  if (document.getElementById(PANEL_ID)) return;

  document.title = "Dravakh Map Studio";
  const { panel, status, backupButton } = createStudioPanel();
  document.body.append(panel);

  const renderStatus = (): void => {
    if (dirty) {
      status.textContent = "Alterações sem backup externo. Salvar no navegador não substitui o arquivo .map.";
      status.style.color = "#e8c766";
      return;
    }

    status.textContent = `Backup externo: ${formatTime(lastBackupAt)}`;
    status.style.color = "#c9c0a8";
  };

  const markDirty = (event: Event): void => {
    if (panel.contains(event.target as Node)) return;
    dirty = true;
    renderStatus();
  };

  backupButton.addEventListener("click", async () => {
    const saveService = getSaveService();
    if (!saveService) {
      status.textContent = "Sistema de salvamento ainda está carregando. Tente novamente em alguns segundos.";
      status.style.color = "#e8c766";
      return;
    }

    backupButton.disabled = true;
    backupButton.textContent = "Gerando...";
    try {
      await saveService.saveMap("machine");
    } finally {
      backupButton.disabled = false;
      backupButton.textContent = "Baixar backup .map";
    }
  });

  window.addEventListener("dravakh:durable-backup", event => {
    const timestamp = (event as CustomEvent<{ at?: number }>).detail?.at || Date.now();
    lastBackupAt = timestamp;
    localStorage.setItem(LAST_BACKUP_KEY, String(timestamp));
    dirty = false;
    renderStatus();
  });

  window.addEventListener("dravakh:browser-save", () => {
    if (!dirty) return;
    status.textContent = "Cópia local atualizada. Ainda falta um backup externo .map.";
    status.style.color = "#e8c766";
  });

  window.addEventListener("pointerup", markDirty, { passive: true });
  window.addEventListener("change", markDirty);
  window.addEventListener("keydown", event => {
    if ((event as KeyboardEvent).key === "Escape") return;
    markDirty(event);
  });

  window.addEventListener("beforeunload", event => {
    if (!dirty) return;
    event.preventDefault();
    event.returnValue = "";
  });

  renderStatus();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", installRuntime, { once: true });
else installRuntime();
