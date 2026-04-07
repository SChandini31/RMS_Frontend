import { useAuth } from "../../context/AuthContext";
import { roleConfig } from "../../utils/roleConfig";

const RoleGuard = ({ permission, children }) => {
  const { user } = useAuth();

  if (!user) return null;

  const allowed = roleConfig[user.role]?.permissions?.[permission];
  if (!allowed) return null;

  return children;
};

export default RoleGuard;