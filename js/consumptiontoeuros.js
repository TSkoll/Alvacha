function convertCubicMetersToEuros(consumption) {
    let rate = 1.96;
    let euros = consumption * rate;
    return euros;
}