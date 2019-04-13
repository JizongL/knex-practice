const ShoppingListService = require('../src/shopping-list-service')
const knex = require('knex')
require('dotenv').config()

describe(`Shopping list service`,()=>{
  let db 
  let testShoppingList =[{
    id:1,
    name:'new item',
    price:'12.00',
    date_added: new Date('2029-01-22T16:28:32.615Z'),
    checked:false,
    category:'Snack'

  },
  {
    id:2,
    name:'new item',
    price:'12.00',
    date_added: new Date('2029-01-22T16:28:32.615Z'),
    checked:false,
    category:'Snack'

  },
  {
    id:3,
    name:'new item',
    price:'12.00',
    date_added: new Date('2029-01-22T16:28:32.615Z'),
    checked:false,
    category:'Snack'

  },
  {
    id:4,
    name:'new item',
    price:'12.00',
    date_added: new Date('2029-01-22T16:28:32.615Z'),
    checked:false,
    category:'Snack'

  }
]
  before(()=>{
    db = knex({
      client:'pg',
      connection:process.env.TEST_DB_URL,
    })
  })

  after(()=>{
    db.destroy()
  })

  before(()=>db('shopping_list').truncate())

  afterEach(()=>db('shopping_list').truncate())
  context(`Given 'shopping_list' has data`,()=>{
    beforeEach(()=>{
      return db
      .into('shopping_list')
      .insert(testShoppingList)
    })

    it(`getAllShoppingItems() resolves all items from shopping_list`,()=>{
      return ShoppingListService.getAllItems(db)
      .then(actual=>{      
        expect(actual).to.eql(testShoppingList)
      })
    })

    it(`getById() resolves an item by id from 'shopping_list' table`,()=>{
      const itemId = 2
      const testItem = testShoppingList[itemId-1]
      
      return ShoppingListService.getById(db,itemId)
      .then(actual=>{
        expect(actual).to.eql(
          testItem          
        )
      })
    })
    it(`deleteItem() removes a bookmark by id from 'shopping_list' table`,()=>{
      const itemId = 3
      return ShoppingListService.deleteItem(db,itemId)
      .then(()=>{items=>{
        const expected = testShoppingList.filter(item=> item.id!==itemId)
        expect(items).to.eql(expected)
      }})
    })
    it(`updateItem() updates an item from the 'shopping_list' table`,()=>{
      const idOfItemToUpdate = 4
      const newItemData={
        id:4,
        name:'new item',
        price:'15.00',
        date_added: new Date('2029-01-22T16:28:32.615Z'),
        checked:false,
        category:'Snack'
      }
      return ShoppingListService.updateItem(db,idOfItemToUpdate,newItemData)
      .then(()=>ShoppingListService.getById(db,idOfItemToUpdate))
      .then(item=>{
        expect(item).to.eql({
          id:idOfItemToUpdate,
          ...newItemData
        })
      })
    })
    
  })
  context(`Given 'shopping_list' has no data`,()=>{
    it(`getAllItems() resolves an empty array`,()=>{
      return ShoppingListService.getAllItems(db)
      .then(actual=>{
        expect(actual).to.eql([])
      })
    })
  })
})