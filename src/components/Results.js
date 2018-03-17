import React from 'react'

export const Results = props => {

    const price = props.inputs.price
    const promotion = props.inputs.promotion
    const quality = props.inputs.quality
    const sales = props.inputs.sales

    const getRevenue = () => ( price * sales )

    const getCoGs = () => -( quality / 100 * 250 * sales )

    const getGrossProfit = () => ( getRevenue() + getCoGs() )

    const getExpenses = () => -( promotion + 800000 )

    const getNetprofit = () => ( getGrossProfit() + getExpenses() )

    const getRoR = () => {
        if (!getNetprofit() || !getRevenue()) return 0
        return ( getNetprofit() / getRevenue() * 100 )
    }

    return (
    <section className = 'Results'>
        <div className = 'spacer'>Total Revenue
            <span>{ getRevenue().toLocaleString() } $</span>
        </div>
        <div  className = 'spacer'>Cost of Goods
            <span>{ getCoGs().toLocaleString() } $</span>
        </div>
        <div  className = 'spacer summer'>Gross Profit
            <span>{ getGrossProfit().toLocaleString() } $</span>
        </div>
        <div className = 'spacer'>Expenses
            <span>{ getExpenses().toLocaleString() } $</span>
        </div>
        <div className = 'spacer summer'>Net Profit:
            <span>{ getNetprofit().toLocaleString() } $</span>
        </div>
        <div className = 'spacer'>Return on Revenue
            <span>{ getRoR().toFixed(2) } %</span>
        </div>
    </section>
    )
}