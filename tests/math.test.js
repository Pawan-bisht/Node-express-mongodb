const {
    calculateTip,
    fahrenheitToCelsius,
    celsiusToFahrenheit,
    add
} = require("../src/math");

test("should calculate total with tip", () => {
    const total = calculateTip(10, .3);

    expect(total).toBe(13);
    // if (total !== 13)
    //     throw new Error("Total is not equal");
})

// test('async test demo', (demo) => {
//     setTimeout(() => {
//         expect(3).toBe(3);
//         demo();
//     }, 3000);
// })

// test('Promise test demo', (demo) => {
//     add(2, 4).then(sum => {
//             return add(sum, 3)
//         })
//         .then(sum2 => {
//             expect(sum2).toBe(9);
//             demo();
//         })
// })

// test('Async/await test demo', async () => {
//     let sum1 = await add(3, 4);
//     expect(sum1).toBe(7);

// })