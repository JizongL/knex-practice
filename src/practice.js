require('dotenv').config()
const knex = require('knex')
console.log(process.env,'test .env')
const knexInstance = knex({
  client: 'pg',
  connection:process.env.DB_URL,
  //connection:"postgres://dunder-mifflin@localhost:5432/knex-practice"
})

console.log('connection successful')

knexInstance('amazong_products').select('*');

// const q1 = knexInstance('amazong_products').select('*').toQuery()
// knexInstance.from('amazong_products').select('*')
//     .then(result =>{
//       console.log(result)
//     })


// knexInstance
//   .select('product_id','name','price','category')    
//   .from('amazong_products')
//   .where({name:'Point of view gun'})
//   .first()
//   .then(result=>{
//     console.log(result)
//   })

function searchByProduceName(searchTerm){
  knexInstance
  .select('product_id','name','price','category')  
  .from('amazong_products')
  .where('name','ILIKE',`%${searchTerm}%`)
  .then(result=>{
    console.log(result)
  })
}

//searchByProduceName('holo')

function paginateProducts(page){
  const productsPerPage = 10
  const offset = productsPerPage * (page-1)
  knexInstance
  .select('product_id','name','price','category')
  .from('amazong_products')
  .limit(productsPerPage)
  .offset(offset)
  .then(result => {
    console.log(result)
  })
}

//paginateProducts(4)

function getProductsWithImages(){
  knexInstance
  .select('product_id','name','price','category','image')
  .from('amazong_products')
  .whereNotNull('image')
  .then(result =>{
    console.log(result)
  })
}

//getProductsWithImages()

function mostPopularVideosForDays(days){
  knexInstance
    .select('video_name','region')
    .count('date_viewed AS views')
    .where(
      'date_viewed',
      '>',
      knexInstance.raw(`now()-'?? days'::INTERVAL`,days)
    )
    .from('whopipe_video_views')
    .groupBy('video_name','region')
    .orderBy([
      { column: 'region',order:'ASC'},
      {column:'views',order: 'DESC'}
    ])
    .then(result=>{
      console.log(result)
    })
}

mostPopularVideosForDays(30)
