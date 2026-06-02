const AuthLayout = ({ children, title }) => {
  return (
    <div
      className="min-h-screen flex justify-center items-center px-4 bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1474487548417-781cb71495f3')",
      }}
    >


      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center text-green-900 mb-6">
          {title}
        </h1>

        {children}

      </div>

    </div>
  );
};

export default AuthLayout;