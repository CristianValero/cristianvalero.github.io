$.terminal.defaults.strings["commandNotFound"] = "Oooooppppsss! Command '%s' not found. Type help :(";

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

const greeting = [
    "Welcome to Cristian Valero's page!",
    "[[b;blue;]  _____      _     _   _             ",
    " / ____|    (_)   | | (_)            ",
    "| |     _ __ _ ___| |_ _  __ _ _ __  ",
    "| |    | '__| / __| __| |/ _` | '_ \\ ",
    "| |____| |  | \\__ \\ |_| | (_| | | | |",
    " \\_____|_|  |_|___/\\__|_|\\__,_|_| |_|]\n"
];

const help = [
    "\n+----------------------------------------------------------------+",
    "| This is the help menu. You can see valid commands below:       |",
    "+----------------------------------------------------------------+",
    "| - bio               Shows Cristian Valero's biography          |",
    "| - twitter           Shows Cristian Valero's twitter            |",
    "| - hello <name>      Say hello to someone                       |",
    "| - kitten            Shows you a beautiful thing                |",
    "| - clear             Clears the prompt                          |",
    "+----------------------------------------------------------------+\n"
];

const commands = {
    bio: function() {
        let bio = "Hy! My name is Cristian and I'm a software developer living at Spain.";
        typed_message(term, bio, 100, function() {
            finish = true;
        });
    },
    twitter: function() {
        this.echo("Cristian Valero's twitter is [[!guib;<GREEN>;>]@titianvalero]");
    },
    help: function() {
        this.echo(help.join("\n"));
    },
    hello: function(what) {
        this.echo('Hello, ' + what + '. Wellcome to the world of @titianvalero.');
    },
    kitten: function() {
        this.echo($('<img src="https://placekitten.com/640/360">'));
    }
};

const term = $('body').terminal(commands, { 
    greetings: greeting.join("\n"),
    prompt: "[[b;cyan;]titianvalero][[b;gray;] $ ]"
});

typed_message(term, "|-> Type help for help. \n", 50, function() {
    finish = true;
});