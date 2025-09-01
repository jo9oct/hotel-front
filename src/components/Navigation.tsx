import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { FaHeart, FaCog, FaUtensils, FaBars, FaTimes, FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PulseLoader } from "react-spinners";
import { useToast } from "@/hooks/use-toast";

interface UserAccountPopupProps {
  handleUpdateAccount: (data: { username: string; password: string; newPassword: string }) => Promise<void>;
}

export const Navigation: React.FC<UserAccountPopupProps> = ({ handleUpdateAccount }) => {
  const { toast } = useToast();

  const [userForm, setUserForm] = useState({
    password: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    newPassword: false,
    confirmPassword: false
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { isAuthenticated, logout, updateProfile, isLoading } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = (field: "password" | "newPassword" | "confirmPassword") => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // Clear input fields and eye toggle state whenever popup closes
  useEffect(() => {
    if (!isProfileOpen) {
      setUserForm({ password: "", newPassword: "", confirmPassword: "" });
      setShowPassword({ password: false, newPassword: false, confirmPassword: false });
    }
  }, [isProfileOpen]);

  const handleUpdateClick = async () => {
    const { password, newPassword, confirmPassword } = userForm;
    if (!password || !newPassword || newPassword !== confirmPassword) {
      toast({ title: "Password Conflict", description: "Passwords do not match." });
      return;
    }

    try {
      await updateProfile({
        currentPassword: password,
        newPassword
      });
      toast({ title: "Password Update", description: "Password Updated Successfully." });
      setIsProfileOpen(false);
    } catch (error) {
      console.error("Error updating account", error);
      toast({
        title: "Password Update",
        description: "Invalid password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogoutClick = () => {
    logout();
    navigate("/");
    window.location.reload();
  };

  const isActive = (path: string) => location.pathname === path;

  const GuestLinks = () => (
    <>
      <Link to="/" onClick={() => setIsMenuOpen(false)}>
        <Button variant={isActive("/") ? "gold" : "ghost"} size="sm" className="w-full sm:w-auto">Menu</Button>
      </Link>
      <Link to="/favorites" onClick={() => setIsMenuOpen(false)}>
        <Button variant={isActive("/favorites") ? "gold" : "ghost"} size="sm" className="w-full sm:w-auto">
          <FaHeart className="mr-2" /> My Orders
        </Button>
      </Link>
      <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
        <Button variant="outline" size="sm" className="w-full sm:w-auto">
          <FaCog className="mr-2" /> Admin
        </Button>
      </Link>
    </>
  );

  const AuthLinks = () => (
    <>
      <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
        <Button variant={isActive("/admin") ? "gold" : "ghost"} size="sm" className="w-full sm:w-auto">Dashboard</Button>
      </Link>
      <Link to="/admin/orders" onClick={() => setIsMenuOpen(false)}>
        <Button variant={isActive("/admin/orders") ? "gold" : "ghost"} size="sm" className="w-full sm:w-auto">Orders</Button>
      </Link>
      <Button variant="outline" size="sm" className="w-full sm:w-auto flex items-center gap-2" onClick={() => setIsProfileOpen(true)}>
        <FaUser /> Profile
      </Button>
    </>
  );

  return (
    <>
      {/* Navigation Bar */}
      <nav className="bg-background border-b border-border/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold-light rounded-lg flex items-center justify-center">
                <FaUtensils className="text-luxury-dark text-lg" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Hotel <span className="text-gold">Feast</span>
              </span>
            </Link>
            <div className="hidden sm:flex items-center space-x-4">
              {isAuthenticated ? <AuthLinks /> : <GuestLinks />}
            </div>
            <div className="sm:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-2xl text-foreground focus:outline-none">
                {isMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>
          {isMenuOpen && <div className="sm:hidden mt-2 space-y-2 flex flex-col">{isAuthenticated ? <AuthLinks /> : <GuestLinks />}</div>}
        </div>
      </nav>

      {/* User Account Popup */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="max-w-md w-full mx-auto">
          <DialogHeader>
            <DialogTitle>Update Account</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mb-4">

            {/* Current Password */}
            <div className="relative">
              <Input
                type={showPassword.password ? "text" : "password"}
                name="password"
                placeholder="Current Password"
                value={userForm.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => togglePasswordVisibility("password")}
              >
                {showPassword.password ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* New Password */}
            <div className="relative">
              <Input
                type={showPassword.newPassword ? "text" : "password"}
                name="newPassword"
                placeholder="New Password"
                value={userForm.newPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => togglePasswordVisibility("newPassword")}
              >
                {showPassword.newPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Input
                type={showPassword.confirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={userForm.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => togglePasswordVisibility("confirmPassword")}
              >
                {showPassword.confirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2">
            {isLoading ? (
              <div className="flex justify-center items-center w-full py-2">
                <PulseLoader color="#6EE7B7" size={10} margin={5} />
              </div>
            ) : (
              <>
                <Button
                  variant="default"
                  onClick={handleUpdateClick}
                  disabled={
                    !userForm.password ||
                    !userForm.newPassword ||
                    userForm.newPassword !== userForm.confirmPassword
                  }
                >
                  Update
                </Button>
                <Button variant="destructive" onClick={handleLogoutClick}>
                  Logout
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
