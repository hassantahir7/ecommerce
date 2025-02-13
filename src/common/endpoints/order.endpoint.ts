enum OrderEndpoints {
    create = '',
    getAllOrders = '',
    findUserAllOrders = '/user',
    findOne = ':orderId',
    getAllCustomersWithOrders = 'getAllCustomersWithOrders',
    updateOrderStatus = 'updateOrderStatus',
    confirmOrder = '/confirmOrder',
    createInquiry = 'createInquiry',
    inquiriesAll = '/inquiries/all',
    respondMail = '/respond/mail'
  }
  
  export { OrderEndpoints };
  