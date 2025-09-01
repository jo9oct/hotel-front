
type foodData = {
    _id : string,
    FoodName : string,
    Price : number,
    Description : string,
    ImageURL : string,
    Category : string
}

export type orderData = {
    _id : string,
    Foods: [foodData],
    OrderType: string,
    OrderNumber: number,
    OrderStatus: string,
    createdAt: string,
    OrderId: number
}