import React from 'react'

export const Results = props => {

    const price = props.inputs.price.value
    const promotion = props.inputs.promotion.value
    const quality = props.inputs.quality.value
    const sales = props.inputs.sales.value

    const getRevenue = () => ( price * sales )

    const getCoGs = () => ( quality / 100 * 250 * sales )

    const getGrossProfit = () => ( getRevenue() - getCoGs() )

    const getExpenses = () => ( promotion + 800000 )

    const getNetprofit = () => ( getGrossProfit() - getExpenses() )

    const getRoR = () => {
        if (!getNetprofit() || !getRevenue()) return 0
        return ( getNetprofit() / getRevenue() * 100 )
    }

    return (
    <section>
        <div>Target Revenue:
            <span>{ getRevenue().toLocaleString() } $</span>
        </div>
        <div>Cost of Goods:
            <span>{ getCoGs().toLocaleString() } $</span>
        </div>
        <div>Gross Profit:
            <span>{ getGrossProfit().toLocaleString() } $</span>
        </div>
        <div>Expenses:
            <span>{ getExpenses().toLocaleString() } $</span>
        </div>
        <div>Net Profit:
            <span>{ getNetprofit().toLocaleString() } $</span>
        </div>
        <div>Return on Revenue:
            <span>{ getRoR().toFixed(2) } %</span>
        </div>
    </section>
    )
}