# Command Line Interface (CLI)

When math.js is installed globally using npm, its expression parser can be used
from the command line. To install math.js globally:

    npm install -g mathjs

Normally, a global installation must be run with admin rights (precede the
command with `sudo`). After installation, the application `mathjs` is available
via the command line:

```bash
$ mathjs
> 12 / (2.3 + 0.7)
4
> 5.08 cm to inch
2 inch
> sin(45 deg) ^ 2
0.5
> 9 / 3 + 2i
3 + 2i
> det([-1, 2; 3, 1])
-7
```

The command line interface can be used to open a prompt, to execute a script,
or to pipe input and output streams:

```bash
$ mathjs                                 # Open a command prompt
$ mathjs script.txt                      # Run a script file, output to console
$ mathjs script.txt > results.txt        # Run a script file, output to file
$ cat script.txt | mathjs                # Run input stream, output to console
$ cat script.txt | mathjs > results.txt  # Run input stream, output to file
```
