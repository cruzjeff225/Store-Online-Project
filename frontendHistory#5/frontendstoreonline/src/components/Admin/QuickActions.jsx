const QuickActions = () => {
    const actions = [
      {
        title: "Agregar Producto",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        ),
        link: "/admin/products/new"
      },
      {
        title: "Ver Reportes",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ),
        link: "/admin/reports"
      },
      {
        title: "Gestionar Usuarios",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ),
        link: "/admin/users"
      }
    ];
  
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Acciones Rápidas</h2>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {actions.map((action, index) => (
              <a
                key={index}
                href={action.link}
                className="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                  {action.icon}
                </div>
                <span className="font-medium">{action.title}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default QuickActions;