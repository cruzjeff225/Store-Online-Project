const RecentActivity = () => {
    const activities = [
      {
        id: 1,
        type: 'order',
        action: 'Pedido completado',
        details: 'Pedido #1234 por $120.00',
        time: 'Hace 10 minutos',
        user: 'Juan Pérez'
      },
      {
        id: 2,
        type: 'product',
        action: 'Producto actualizado',
        details: 'iPhone 13 Pro - Stock actualizado',
        time: 'Hace 25 minutos',
        user: 'María Gómez'
      },
      {
        id: 3,
        type: 'user',
        action: 'Nuevo usuario registrado',
        details: 'Carlos Rodríguez (carlos@example.com)',
        time: 'Hace 1 hora',
        user: 'Sistema'
      },
      {
        id: 4,
        type: 'payment',
        action: 'Pago procesado',
        details: 'Transacción #PAY-7890 - $85.00',
        time: 'Hace 2 horas',
        user: 'Sistema'
      }
    ];
  
    const getIcon = (type) => {
      switch(type) {
        case 'order':
          return (
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          );
        case 'product':
          return (
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          );
        case 'user':
          return (
            <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          );
        default:
          return (
            <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          );
      }
    };
  
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Actividad Reciente</h2>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="p-1 rounded-full bg-gray-100">
                    {getIcon(activity.type)}
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <p className="text-sm text-gray-600">{activity.details}</p>
                  <p className="text-xs text-gray-500 mt-1">Por: {activity.user}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Ver toda la actividad
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default RecentActivity;