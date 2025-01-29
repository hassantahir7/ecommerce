enum OrderEndpoints {
    create = '',
    getAllOrders = '',
    findUserAllOrders = '/user',
    findOne = ':orderId',
    getAllCustomersWithOrders = 'getAllCustomersWithOrders',
    updateOrderStatus = 'updateOrderStatus'
  }
  
  export { OrderEndpoints };
  