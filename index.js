var unbounce = function (fn, opts) {

    opts = opts || {
        bailOnErrors: true
    };

    return (function() {

        // Is the target function in the middle of a run?
        var running = false;
        // Vars to hold options and cb for the next run of the target function.
        var queuedOpts = null;
        var queuedCb = null;

        // Return a wrapped version of the target function
        return function unbounced(options, cb) {

            // Default cb to an empty function
            cb = cb || function() {};

            // If the target function is running, set the queued options and cb
            // to whatever was passed in (overwriting any previous values)
            if (running) {
                queuedOpts = options;
                queuedCb = cb;
                return;
            }

            // Set flag indicating that target function is running
            running = true;

            // Run the target function
            fn(options, function(err, result) {

                // Clear flag indicating that target function is running
                running = false;

                // Run the callback passed in to the target function
                cb(err, result);

                // If there was an error and "bailOnErrors" is true, 
                // just return without checking whether there's a queued run
                if (err && opts.bailOnErrors) {return;}

                // If we've queued another run of the target function, run it now
                // with the queued options and callback
                if (queuedOpts) {
                    unbounced(queuedOpts, queuedCb);
                    queuedOpts = null;
                    queuedCb = null;
                }
            });

        };

    })();
};
module.exports = unbounce;