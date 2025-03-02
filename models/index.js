(() => {
    require('fs').readdirSync(__dirname).forEach(model => require(`./${model}`));
})()