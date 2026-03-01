interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink = ({ href, children }: NavLinkProps) => {
  return (
    <a
      href={href}
      className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
    >
      {children}
    </a>
  );
};

export default NavLink;
