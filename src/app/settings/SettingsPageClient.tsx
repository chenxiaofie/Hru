"use client";
import { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Avatar,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ShieldIcon from "@mui/icons-material/Shield";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ThemedSnackbar from "../../components/ThemedSnackbar";
import HomeIcon from "@mui/icons-material/Home";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

interface Contact {
  id: number;
  name: string;
  email: string;
}

async function recordVisit(token: string) {
  await fetch("/api/visit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
}

async function getLastVisit(): Promise<Date | null> {
  const last = localStorage.getItem("hru_last_visit");
  return last ? new Date(last) : null;
}

async function notifyIfNeeded(token: string) {
  const lastVisit = await getLastVisit();
  const now = new Date();
  if (!lastVisit || now.getTime() - lastVisit.getTime() > 1 * 60 * 1000) {
    await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
  }
}

export default function SettingsPageClient() {
  const t = useTranslations();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [year, setYear] = useState<number | null>(null);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "zh";

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("hru_token");
    setHasToken(!!token);
    if (token) {
      setFetching(true);
      recordVisit(token);
      notifyIfNeeded(token);
      fetch("/api/contacts", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setContacts(data);
          if (data && data.length > 0) {
            setName(data[0].name);
          }
          setFetching(false);
        });
    } else {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    if (contacts.length > 0 && !name) {
      setName(contacts[0].name);
    }
  }, [contacts, name]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/anon-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, contactEmail: email }),
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem("hru_token", data.token);
      setHasToken(true);
      setSnackbarMsg(t("registration_success"));
      setSnackbarOpen(true);
      fetch("/api/contacts", {
        headers: { Authorization: `Bearer ${data.token}` },
      })
        .then((res) => res.json())
        .then(setContacts);
      setName("");
      setEmail("");
    } else {
      setSnackbarMsg(data.error || t("registration_failed"));
      setSnackbarOpen(true);
    }
    setLoading(false);
  };

  const addContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("hru_token");
    const res = await fetch("/api/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email, token }),
    });
    const newContact = await res.json();
    if (res.ok && !newContact.error) {
      setContacts([...contacts, newContact]);
      setSnackbarMsg(t("add_success"));
      setSnackbarOpen(true);
      setName("");
      setEmail("");
    } else {
      setSnackbarMsg(newContact.error || t("add_failed"));
      setSnackbarOpen(true);
    }
    setLoading(false);
  };

  const handleEdit = (contact: Contact) => {
    setEditId(contact.id);
    setName(contact.name);
    setEmail(contact.email);
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    setLoading(true);
    const token = localStorage.getItem("hru_token");
    const res = await fetch("/api/contacts", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: editId, name, email, token }),
    });
    const updated = await res.json();
    if (res.ok && !updated.error) {
      setContacts(contacts.map((c) => (c.id === updated.id ? updated : c)));
      setSnackbarMsg(t("edit_success"));
      setSnackbarOpen(true);
      setEditId(null);
      setName("");
      setEmail("");
    } else {
      setSnackbarMsg(updated.error || t("edit_failed"));
      setSnackbarOpen(true);
    }
    setLoading(false);
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setName("");
    setEmail("");
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setLoading(true);
    const token = localStorage.getItem("hru_token");
    const res = await fetch(`/api/contacts?id=${deleteId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await res.json();
    if (res.ok && result.ok) {
      setContacts(contacts.filter((c) => c.id !== deleteId));
      setSnackbarMsg(t("delete_success"));
      setSnackbarOpen(true);
      setDeleteOpen(false);
    } else {
      setSnackbarMsg(result.error || t("delete_failed"));
      setSnackbarOpen(true);
    }
    setLoading(false);
  };

  const handleSnackbarClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  if (fetching) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
        sx={{
          background: "linear-gradient(135deg, #4FC3F7 0%, #81C784 100%)",
          minHeight: "100vh",
          width: "100vw",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      minHeight="100vh"
      width="100vw"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        background: "linear-gradient(135deg, #4FC3F7 0%, #81C784 100%)",
        transition: "background 0.5s",
      }}
      p={2}
    >
      <Stack alignItems="center" spacing={2} mb={2}>
        <Avatar sx={{ bgcolor: "#fff", width: 64, height: 64, boxShadow: 2 }}>
          <ShieldIcon color="primary" sx={{ fontSize: 40 }} />
        </Avatar>
        <Typography
          variant="h5"
          fontWeight={700}
          color="#fff"
          letterSpacing={2}
        >
          {t("emergency_contact_settings")}
        </Typography>
        <Typography variant="subtitle2" color="#fff" fontWeight={400}>
          {t("guard_family")}
        </Typography>
        <Button
          startIcon={<HomeIcon />}
          variant="outlined"
          color="primary"
          sx={{
            borderRadius: 3,
            fontWeight: 600,
            mt: 1,
            bgcolor: "rgba(255,255,255,0.15)",
            color: "#fff",
            borderColor: "#fff",
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.25)",
              borderColor: "#B2EBF2",
            },
          }}
          onClick={() => router.push(`/${locale}`)}
        >
          {t("back_home")}
        </Button>
      </Stack>
      <Card
        sx={{
          width: "100%",
          maxWidth: 400,
          borderRadius: 4,
          boxShadow: 4,
          bgcolor: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(2px)",
        }}
      >
        <CardContent>
          {!hasToken ? (
            <>
              <Typography variant="h6" fontWeight={700} mb={2}>
                {t("set_personal_info")}
              </Typography>
              <form onSubmit={handleRegister}>
                <TextField
                  label={t("my_name_label")}
                  placeholder={t("my_name_placeholder")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label={t("emergency_contact_email_label")}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                  margin="normal"
                />
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  disabled={loading}
                  sx={{ mt: 2, borderRadius: 3, fontWeight: 600 }}
                >
                  {loading ? t("submitting") : t("submit")}
                </Button>
              </form>
            </>
          ) : (
            <>
              <Typography variant="h6" fontWeight={700} mb={2}>
                {t("emergency_contact_management")}
              </Typography>
              <form onSubmit={editId ? handleEditSave : addContact}>
                <TextField
                  label={t("my_name_label")}
                  placeholder={t("my_name_placeholder")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label={t("emergency_contact_email_label")}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                  margin="normal"
                />
                {editId ? (
                  <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{
                        borderRadius: 3,
                        fontWeight: 600,
                        flex: 1,
                        background:
                          "linear-gradient(90deg, #38B2AC 0%, #388E3C 100%)",
                      }}
                      disabled={loading}
                    >
                      {loading ? t("saving") : t("save_changes")}
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      fullWidth
                      sx={{
                        borderRadius: 3,
                        fontWeight: 600,
                        flex: 1,
                        bgcolor: "#fff",
                        color: "#38B2AC",
                        border: "2px solid #38B2AC",
                        boxShadow: "0 1px 4px rgba(56,178,172,0.08)",
                        "&:hover": {
                          bgcolor: "#E0F7FA",
                          color: "#388E3C",
                          borderColor: "#388E3C",
                        },
                      }}
                    >
                      {t("cancel")}
                    </Button>
                  </Stack>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                    disabled={loading}
                    sx={{
                      mt: 2,
                      borderRadius: 3,
                      fontWeight: 600,
                      background:
                        "linear-gradient(90deg, #38B2AC 0%, #388E3C 100%)",
                      "&:hover": {
                        background:
                          "linear-gradient(90deg, #388E3C 0%, #38B2AC 100%)",
                      },
                    }}
                  >
                    {loading ? t("adding") : t("add")}
                  </Button>
                )}
              </form>
              <List sx={{ mt: 2 }}>
                {contacts.map((c) => (
                  <ListItem
                    key={c.id}
                    divider
                    secondaryAction={
                      <>
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={() => handleEdit(c)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          color="error"
                          onClick={() => handleDelete(c.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    }
                  >
                    <ListItemText primary={c.name} secondary={c.email} />
                  </ListItem>
                ))}
              </List>
              <Dialog
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                PaperProps={{
                  sx: {
                    background:
                      "linear-gradient(135deg, #4FC3F7 0%, #38B2AC 60%, #388E3C 100%)",
                    color: "#fff",
                    borderRadius: 4,
                    boxShadow: 6,
                    px: 2,
                    py: 1.5,
                    minWidth: 320,
                    backdropFilter: "blur(8px)",
                  },
                }}
              >
                <DialogTitle
                  sx={{
                    fontWeight: 700,
                    fontSize: 20,
                    color: "#fff",
                    textAlign: "center",
                    letterSpacing: 1,
                  }}
                >
                  {t("confirmation_title")}
                </DialogTitle>
                <DialogContent>
                  <Typography
                    sx={{
                      color: "#fff",
                      fontSize: 16,
                      textAlign: "center",
                      mb: 1,
                    }}
                  >
                    {t("confirm_delete_contact")}
                  </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
                  <Button
                    onClick={() => setDeleteOpen(false)}
                    sx={{
                      borderRadius: 3,
                      fontWeight: 700,
                      minWidth: 80,
                      bgcolor: "#fff",
                      color: "#38B2AC",
                      border: "2px solid #38B2AC",
                      boxShadow: "0 1px 4px rgba(56,178,172,0.08)",
                      "&:hover": {
                        bgcolor: "#E0F7FA",
                        color: "#388E3C",
                        borderColor: "#388E3C",
                      },
                    }}
                  >
                    {t("cancel")}
                  </Button>
                  <Button
                    onClick={handleDeleteConfirm}
                    variant="contained"
                    disabled={loading}
                    sx={{
                      borderRadius: 3,
                      fontWeight: 600,
                      minWidth: 80,
                      boxShadow: 2,
                      background:
                        "linear-gradient(90deg, #38B2AC 0%, #388E3C 100%)",
                      color: "#fff",
                      "&:hover": {
                        background:
                          "linear-gradient(90deg, #388E3C 0%, #38B2AC 100%)",
                      },
                    }}
                  >
                    {t("delete")}
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}
        </CardContent>
      </Card>
      <ThemedSnackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={snackbarMsg}
        autoHideDuration={1800}
      />
      <Typography variant="caption" color="#fff" mt={4}>
        hru · 安心提醒 · {year ?? ""}
      </Typography>
      <Typography variant="caption" color="#fff" mt={1}>
        作者：Feifei Chen &lt;feifeichen1999@gmail.com&gt;
      </Typography>
    </Box>
  );
}
