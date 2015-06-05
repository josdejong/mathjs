---
layout: default
---

<h1 id="command-line-debugging">Command Line Debugging <a href="#command-line-debugging" title="Permalink">#</a></h1>

For debugging purposes, `bin/repl.js` provides a REPL (Read Evaluate Print Loop)
for interactive testing of mathjs without having to build new build files after every
little change to the source files. You can either start it directly (`./repl.js`) or
via node (`node repl.js`).

You can exit using either [ctrl]-[C] or [ctrl]-[D].

```bash
$ ./repl.js 
> math.parse('1+1')
{ op: '+',
  fn: 'add',
  args: 
   [ { value: '1', valueType: 'number' },
     { value: '1', valueType: 'number' } ] }
> 
```
