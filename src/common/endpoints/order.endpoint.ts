enum OrderEndpoints {
    create = '',
    getAllOrders = '',
    findUserAllOrders = '/user',
    findOne = ':orderId',
    getAllCustomersWithOrders = 'getAllCustomersWithOrders',
    updateOrderStatus = 'updateOrderStatus',
    confirmOrder = '/confirmOrder',
    createInquiry = 'createInquiry'
  }
  
  export { OrderEndpoints };
  