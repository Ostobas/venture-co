import gameSetup from '../gameSetup.json'

export const marketModel = {
    
    setup: gameSetup.setup.marketModel,

    sum: values =>
        values.reduce((total, num) => 
            total + num, 0
        ),

    avg: values => 
        values.length ? 
        marketModel.sum(values) / values.length : 0,

    getPriceIndexes: priceArr => {
        const setup = marketModel.setup.price

        return priceArr.map( price => 
            Math.min(
                Math.max((setup.max - price) / (setup.max - setup.min), 0)
            , 1) ** setup.alfa
        )
    },

    getPromotionIndexes: promoArr => {
        const setup = marketModel.setup.promotion
        return promoArr.map(promotion => 
            Math.max(Math.atan(promotion / setup.mean) / (Math.PI / 2), 0)
        )
    },

    getQualityIndexes: qualityArr => 
        qualityArr.map(quality => quality / 100),

    getWeightedIndexes: inputs => {
        const weights = marketModel.setup.weights
        const priceIndexes = marketModel.getPriceIndexes(inputs.price)
        const promotionIndexes = marketModel.getPromotionIndexes(inputs.promotion)
        const qualityIndexes = marketModel.getQualityIndexes(inputs.quality)

        let resultArr = []
        for (let i = 0; i < priceIndexes.length; i++) {
            resultArr.push(
				priceIndexes[i] * weights.price / 100 +
				promotionIndexes[i] * weights.promotion / 100 +
				qualityIndexes[i] * weights.quality / 100
			)
        }
        return resultArr
    },

    getMarketRatings: indexArr => {
        const setup = marketModel.setup.market
        const avgIndex = marketModel.avg(indexArr)
        return indexArr.map(index => ( index / avgIndex )  ** setup.elasticity )
    },

    getMarketShares: valueArr => valueArr.map(rating => 
        rating / marketModel.sum(valueArr)
    ),

    getDemands: ( shares, demand ) => 
        shares.map(share =>
            Math.round(share * demand)
        ),

    getSales: (inputs, demand) => {
        const weightedIndexes = marketModel.getWeightedIndexes(inputs)
        const marketRatings = marketModel.getMarketRatings(weightedIndexes)
        const baseShares = marketModel.getMarketShares(marketRatings)
        const demands = marketModel.getDemands(baseShares, demand)
        return demands
    }
}