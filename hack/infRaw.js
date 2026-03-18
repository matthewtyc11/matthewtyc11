(function hookNoa() {
    if (window.noa) { console.log('noa already present'); return; }
    const orig = Function.prototype.call;
    let captured = false;
    Function.prototype.call = function (thisArg, ...args) {
        try {
            if (!captured) {
                const c = args[0];
                if (c && c.entities && c.bloxd) {
                    captured = true;
                    window.noa = c;
                    console.log('Hooked noa instance', c);
                    Function.prototype.call = orig;
                }
            }
        } catch (e) {
        }
        return orig.apply(this, [thisArg, ...args]);
    };
    setTimeout(() => { if (!captured) Function.prototype.call = orig; }, 30000);
})();
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let _noaToggleRun = false;
let _noaLoopRunning = false;

window.addEventListener('keydown', async (event) => {
    if (!window.noa) return;
    if (event.key.toLowerCase() === 'h') {
        _noaToggleRun = !_noaToggleRun;
        if (_noaToggleRun && !_noaLoopRunning) {
            _noaLoopRunning = true;
            const inputs = noa.inputs;
            while (_noaToggleRun) {
                noa.entities.setPosition(1, [64.5, 51, 190.5]);
                //noa.entities.setPosition(1, [9.5, 37, -16.5])
                for (let i = 0; i < 3; i++) {
                    inputs.down._events?.['primary-fire']?.(0);
                    await wait(40);
                    inputs.up._events?.['primary-fire']?.(0);
                    await wait(40);
                }
            }
            noa.inputs.up._events?.['primary-fire']?.(0);
            _noaLoopRunning = false;
        } else {
            noa.inputs.up._events?.['primary-fire']?.(0);
        }
    }

});

