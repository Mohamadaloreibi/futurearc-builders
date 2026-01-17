import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Download, Trash2, Search, LogOut, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface WaitlistSignup {
  id: string;
  email: string;
  experience: string | null;
  interests: string | null;
  created_at: string;
}

const Admin = () => {
  const [signups, setSignups] = useState<WaitlistSignup[]>([]);
  const [filteredSignups, setFilteredSignups] = useState<WaitlistSignup[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/auth");
      } else if (!isAdmin) {
        toast({
          title: "Access denied",
          description: "You don't have admin permissions.",
          variant: "destructive",
        });
        navigate("/");
      }
    }
  }, [user, isAdmin, loading, navigate, toast]);

  useEffect(() => {
    if (isAdmin) {
      fetchSignups();
    }
  }, [isAdmin]);

  useEffect(() => {
    let filtered = signups;

    if (searchQuery) {
      filtered = filtered.filter(
        (s) =>
          s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.interests?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (experienceFilter !== "all") {
      filtered = filtered.filter((s) => s.experience === experienceFilter);
    }

    setFilteredSignups(filtered);
  }, [signups, searchQuery, experienceFilter]);

  const fetchSignups = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("waitlist_signups")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load signups.",
        variant: "destructive",
      });
    } else {
      setSignups(data || []);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("waitlist_signups").delete().eq("id", id);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete signup.",
        variant: "destructive",
      });
    } else {
      setSignups(signups.filter((s) => s.id !== id));
      toast({ title: "Deleted", description: "Signup removed." });
    }
  };

  const handleExport = () => {
    const headers = ["Email", "Experience", "Interests", "Signed Up"];
    const rows = filteredSignups.map((s) => [
      s.email,
      s.experience || "",
      s.interests || "",
      new Date(s.created_at).toLocaleDateString(),
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `waitlist-signups-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => navigate("/")}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Waitlist Dashboard
              </h1>
            </div>
            <p className="text-muted-foreground">
              {filteredSignups.length} of {signups.length} signups
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={handleExport} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={handleSignOut} variant="ghost" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by email or interests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={experienceFilter} onValueChange={setExperienceFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="junior">Junior</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
            </div>
          ) : filteredSignups.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              No signups found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead className="hidden md:table-cell">Interests</TableHead>
                  <TableHead>Signed Up</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSignups.map((signup) => (
                  <TableRow key={signup.id}>
                    <TableCell className="font-medium">{signup.email}</TableCell>
                    <TableCell>
                      <span className="capitalize text-sm px-2 py-1 rounded-full bg-muted">
                        {signup.experience || "—"}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell max-w-xs truncate">
                      {signup.interests || "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(signup.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleDelete(signup.id)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Admin;
