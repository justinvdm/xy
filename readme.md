# xy
draw a line chart from piped in json data in the command line.

![example](https://raw.github.com/justinvdm/xy/master/example.gif)


## install

```
$ npm install -g @justinvdm/xy
```


## usage

```
$ xy --help
Usage: xy [options]

Options:
  --help       Show help                                               [boolean]
  -n           displays the last n datapoints                       [default: 0]
  --slurp, -s  read the entire input stream and draw just once         [boolean]
  --color, -c  css color string to use for each set              [default: null]
  --set, -S    declare a set by its key to match it to a color     [default: []]
  --time, -t   format x values from unix epoch milliseconds to date strings
                                                                       [boolean]
  -x           property name for x values                         [default: "x"]
  -y           property name for y values                         [default: "y"]
  --key, -k    property name to identify the set each datum belongs to
  --min, -m    minimum y value                                   [default: null]
  --max, -M    maximum y value                                   [default: null]
```
