require('dotenv').config()
const knex = require('knex')
const knexInstance = knex({
  client:'pg',
  connection:process.env.DB_URL
})

console.log('connection successful')

const getItemsWithText = function(searchTerm){
  knexInstance
  .select('name')
  .from('shopping_list')
  .where('name','ILIKE',`%${searchTerm}%`)
  .then(result=>{
    console.log(result)
  })
}

// getItemsWithText('steak')

const paginateItems=function(pageNumber){
  const productPerPage = 6;
  const offset = (pageNumber-1)*productPerPage;
  knexInstance
  .select('*')
  .from('shopping_list')
  .limit(productPerPage)
  .offset(offset)
  .then(result=>{
    console.log(result)
  })
}

//paginateItems(3)

const getItemsAfterDates = function(daysAgo){
  knexInstance
  .select('*')
  .from('shopping_list')
  .where('date_added','>',knexInstance.raw(
    `now()-'?? days'::INTERVAL`,daysAgo
  )).then(result=>{
    console.log(result)
  })
}


//getItemsAfterDates(10)

const getTotalCost = function(){
  knexInstance
  .select('category')
  .count('price as total')
  .from('shopping_list')
  .groupBy('category')
  .then(result=>{
    console.log('COST PER CATEGORY')
    console.log(result)
  })
}

//getTotalCost()
