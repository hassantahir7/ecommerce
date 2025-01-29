enum ProductsEndpoints {
    create = '',
    findAll = '',
    findOne = '/:id',
    update = '/:id',
    remove = '/:id',
    findColorsByCategory = '/findColorsByCategory',
    searchProducts = '/searchProducts',
    retrieveLimitedEditionProducts = 'retrieveLimitedEditionProducts/all',
    addToFavorite = 'addToFavorite',
    getUserFavoriteItems = 'getUserFavoriteItems'
  }
  
  export { ProductsEndpoints };
  