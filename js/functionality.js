let anim = false;
function typed(finish_typing) {
    return function(term, message, delay, finish) {
        anim = true;
        var prompt = term.get_prompt();
        var c = 0;

        if (message.length > 0) {
            term.set_prompt('');
            var new_prompt = '';
            var interval = setInterval(function() {
                var chr = $.terminal.substring(message, c, c+1);
                new_prompt += chr;
                term.set_prompt(new_prompt);
                c++;

                if (c == length(message)) {
                    clearInterval(interval);
                    setTimeout(function() {
                        finish_typing(term, message, prompt);
                        anim = false
                        finish && finish();
                    }, delay);
                }
            }, delay);
        }
    };
};

function length(string) {
    string = $.terminal.strip(string);
    return $('<span>' + string + '</span>').text().length;
}

const typed_prompt = typed(function(term, message, prompt) {
    term.set_prompt(message + ' ');
});

const typed_message = typed(function(term, message, prompt) {
    term.echo(message)
    term.set_prompt(prompt);
});

const messages = {
    greeting: [
        "Welcome to Cristian Valero's page!",
        "[[b;blue;]  _____      _     _   _             ",
        " / ____|    (_)   | | (_)            ",
        "| |     _ __ _ ___| |_ _  __ _ _ __  ",
        "| |    | '__| / __| __| |/ _` | '_ \\ ",
        "| |____| |  | \\__ \\ |_| | (_| | | | |",
        " \\_____|_|  |_|___/\\__|_|\\__,_|_| |_|]\n"
    ],
    help: [
        "\n+----------------------------------------------------------------+",
        "| This is the help menu. You can see valid commands below:       |",
        "+----------------------------------------------------------------+",
        "| - bio               Shows Cristian Valero's biography          |",
        "| - twitter           Shows Cristian Valero's Twitter            |",
        "| - hello <name>      Say hello to someone                       |",
        "| - kitten            Shows you a beautiful thing                |",
        "| - clear             Clears the prompt                          |",
        "+----------------------------------------------------------------+\n"
    ],
    command_not_found: "Oooooppppsss! Command '%s' not found. Type help :(",
    type_help: "|-> Type help for help. \n",
    biography: "Hi! My name is Cristian and I'm a software developer living in Spain.",
    twitter: "Cristian Valero's twitter is [[b;blue;]@titianvalero]",
    hello: "Hello, %s%. Welcome to the world of @titianvalero."
};

$.terminal.defaults.strings["commandNotFound"] = messages["command_not_found"];

const commands = {
    bio: function() {
        typed_message(term, messages[biography], 100, function() {
            finish = true;
        });
    },
    twitter: function() {
        this.echo(messages["twitter"]);
    },
    help: function() {
        this.echo(messages[this.help].join("\n"));
    },
    hello: function(what) {
        this.echo(messages[hello].replaceAll("%s%", what));
    },
    kitten: function() {
        this.echo($('<img src="https://placekitten.com/640/360">'));
    }
};

const term = $('body').terminal(commands, { 
    greetings: messages["greeting"].join("\n"),
    prompt: "[[b;cyan;]titianvalero][[b;gray;] $ ]"
});

typed_message(term, messages["type_help"], 50, function() {
    finish = true;
});