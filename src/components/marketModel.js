export const marketModel = {
    getPrice: (inputs) => {
        console.log(inputs)
        return inputs.price
    },

    getSales: (inputs) => {
        const p = marketModel.getPrice(inputs)
        return p * 2
    }
}