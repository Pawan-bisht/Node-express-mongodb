const {
    calculateTip,
    fahrenheitToCelsius,
    celsiusToFahrenheit
} = require("../src/math");

test("should calculate total with tip", () => {
    const total = calculateTip(10, .3);

    expect(total).toBe(13);
    // if (total !== 13)
    //     throw new Error("Total is not equal");
})