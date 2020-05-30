const {
    fahrenheitToCelsius,
    celsiusToFahrenheit
} = require("../src/math");

test("converting feh to cel", () => {
    const cel = fahrenheitToCelsius(32);
    expect(cel).toBe(0);
})

test("converting cel to feh", () => {
    const feh = celsiusToFahrenheit(0);
    expect(feh).toBe(32);
})