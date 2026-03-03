import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="border-b border-border py-4 px-6 md:px-12 flex items-center justify-between bg-white sticky top-0 z-50">
      <div className="flex items-center gap-12">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">Q</div>
          <span className="text-2xl font-bold text-text-dark">QuickHire</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-text-gray font-medium">
          <Link href="/" className="hover:text-primary transition-colors">Find Jobs</Link>
          <Link href="#" className="hover:text-primary transition-colors">Browse Companies</Link>
          <Link href="/admin" className="hover:text-primary transition-colors">Admin Panel</Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-primary font-bold px-4 py-2">Login</button>
        <button className="bg-primary text-white font-bold px-6 py-2 rounded-sm">Sign Up</button>
      </div>
    </nav>
  );
};

export default Navbar;
