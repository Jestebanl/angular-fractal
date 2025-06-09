// Interface para Toast
export interface Toast {
  backgroundColor: string;
  iconBackgroundColor: string;
  iconColor: string;
  iconDescription: string;
  iconPath: string;
  textColor: string;
}

// Toasts para cada categoría
export const toasts: { [key: string]: Toast } = {
  // Toast para Componentes UI
  "ui-components-toast": {
    backgroundColor: "text-blue-800 bg-blue-50 dark:text-blue-400 dark:bg-gray-800",
    iconBackgroundColor: "text-blue-500 bg-blue-100 dark:bg-blue-800 dark:text-blue-200",
    iconColor: "text-blue-500",
    iconDescription: "Icono UI",
    iconPath: "M4 6h16M4 12h16m-7 6h7",
    textColor: "text-gray-500 dark:text-gray-400"
  },
  
  // Toast para Servicios
  "services-toast": {
    backgroundColor: "text-yellow-800 bg-yellow-50 dark:text-yellow-400 dark:bg-gray-800",
    iconBackgroundColor: "text-yellow-500 bg-yellow-200 dark:bg-yellow-700 dark:text-yellow-300",
    iconColor: "text-yellow-600",
    iconDescription: "Icono servicio",
    iconPath: "M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5",
    textColor: "text-gray-500 dark:text-gray-400"
  },
  
  // Toast para Modelos
  "models-toast": {
    backgroundColor: "text-green-800 bg-green-50 dark:text-green-400 dark:bg-gray-800",
    iconBackgroundColor: "text-green-500 bg-green-200 dark:bg-green-700 dark:text-green-300",
    iconColor: "text-green-600",
    iconDescription: "Icono modelo",
    iconPath: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    textColor: "text-gray-500 dark:text-gray-400"
  },
  
  // Toast para Guards
  "guards-toast": {
    backgroundColor: "text-red-800 bg-red-50 dark:text-red-400 dark:bg-gray-800",
    iconBackgroundColor: "text-red-500 bg-red-200 dark:bg-red-700 dark:text-red-300",
    iconColor: "text-red-600",
    iconDescription: "Icono guard",
    iconPath: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
    textColor: "text-gray-500 dark:text-gray-400"
  }
};