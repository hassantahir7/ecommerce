enum ProductsEndpoints {
    create = '',
    findAll = '',
    findOne = '/:id',
    update = '/:id',
    remove = '/:id',
    findColorsByCategory = '/findColorsByCategory',
    searchProducts = '/searchProducts',
    retrieveLimitedEditionProducts = 'retrieveLimitedEditionProducts',
    addToFavorite = 'addToFavorite',
    getUserFavoriteItems = 'getUserFavoriteItems'
  }
  
  export { ProductsEndpoints };
  