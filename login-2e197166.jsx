/* Login screen */
function LoginScreen(){
  const [email, setEmail] = React.useState('pm@dunrite.com');
  const [password, setPassword] = React.useState('');
  const [err, setErr] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await window.AUTH.login(email, password||'demo');
    setLoading(false);
    if(!res.ok) setErr(res.err);
    else window.location.reload();
  };

  return React.createElement('div',{className:'login-screen'},
    React.createElement('div',{className:'login-box'},
      React.createElement('div',{className:'login-logo'},
        React.createElement('div',{style:{width:80,height:80,background:'#1DB4E8',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:48,fontWeight:'bold',color:'white'}},'D')
      ),
      React.createElement('h1',null,'Dun Rite Construction'),
      React.createElement('p',{className:'login-sub'},'Project Controls Portal'),

      React.createElement('form',{onSubmit:handleLogin,className:'login-form'},
        React.createElement('label',null,
          React.createElement('div',null,'Email'),
          React.createElement('input',{
            type:'email',
            placeholder:'pm@dunrite.com',
            value:email,
            onChange:(e)=>{setEmail(e.target.value);setErr('')},
            disabled:loading,
            autoFocus:true
          })
        ),
        React.createElement('label',null,
          React.createElement('div',null,'Password'),
          React.createElement('input',{
            type:'password',
            placeholder:'(demo mode: any password)',
            value:password,
            onChange:(e)=>{setPassword(e.target.value);setErr('')},
            disabled:loading
          })
        ),
        err && React.createElement('div',{className:'err'},err),
        React.createElement('button',{type:'submit',className:'btn btn--primary',style:{width:'100%'},disabled:loading},
          loading ? 'Signing in...' : 'Sign In'
        )
      ),

      React.createElement('div',{className:'login-divider'},'Demo Users'),
      React.createElement('div',{className:'login-demo'},
        React.createElement('button',{
          type:'button',
          className:'demo-user',
          onClick:()=>{setEmail('pm@dunrite.com');setPassword('')},
          disabled:loading
        },
          React.createElement('div',null,'Sarah Johnson'),
          React.createElement('span',null,'Project Manager')
        ),
        React.createElement('button',{
          type:'button',
          className:'demo-user',
          onClick:()=>{setEmail('super@dunrite.com');setPassword('')},
          disabled:loading
        },
          React.createElement('div',null,'Mike Torres'),
          React.createElement('span',null,'Superintendent')
        ),
        React.createElement('button',{
          type:'button',
          className:'demo-user',
          onClick:()=>{setEmail('finance@dunrite.com');setPassword('')},
          disabled:loading
        },
          React.createElement('div',null,'Lisa Chen'),
          React.createElement('span',null,'Finance Director')
        ),
        React.createElement('button',{
          type:'button',
          className:'demo-user',
          onClick:()=>{setEmail('owner@dunrite.com');setPassword('')},
          disabled:loading
        },
          React.createElement('div',null,'David Wilson'),
          React.createElement('span',null,'Principal')
        ),
        React.createElement('button',{
          type:'button',
          className:'demo-user',
          onClick:()=>{setEmail('roryulloa@gmail.com');setPassword('')},
          disabled:loading
        },
          React.createElement('div',null,'Rory Ulloa'),
          React.createElement('span',null,'Administrator')
        )
      )
    )
  );
}

Object.assign(window,{LoginScreen});

