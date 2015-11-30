// add a reference to passport
var LocalStrategy = require('passport-local').Strategy;

//user the User
var User = require('../models/user');

module.exports = function(passport) 
{
	
	// SETUP for session retrival
	
	//serialize user
	passport.serializeUser(function(user, done) 
	{
		done(null, user);
	});
	
	//deserialze user
	passport.deserializeUser(function(id, done) 
	{
		User.findById(id, function(err, user) 
		{
			done(err, user);
		});
	});
	
	passport.use('local-login', new LocalStrategy({
		passReqToCallback: true
	},
	function(req, username, password, done) 
	{
		
		// asynchronous
		process.nextTick(function() 
		{
			User.findOne({
				'username':username
			}, 
			function(err, user) 
			{
				if(err) 
				{
					return done(err);
				}
				
				//user is not real or wrong
				if(!user) 
				{
					return done(null, false, req.flash('loginMessage', 'Incorrect Username'));
				}
				
				//passowrd is wrong
				if(!user.validPassword(password)) 
				{
					return done(null, false, req.flash('loginMessage', 'Incorrect Password'));
				}
				
				//everything is A,OK
				return done(null, user);
			});
		});
	}));
	
	// Configure registration to the local strategy
	passport.use('local-registration', new LocalStrategy({
		passReqToCallback: true
	},
	
	function(req, username, password, done) 
	{
		
		//asynchronous
		process.nextTick(function() 
		{
			// if user is logged in already
			if(!req.user) 
			{
				User.findOne({'username': username},
				function(err, user) 
				{
					//if any errors happen
					if(err) 
					{
						return done(err);
					}
					//check if username is in use
					if(user) 
					{
						return done(null, false, req.flash('registrationMessage', 'The username is already take'));
					}
					else 
					{
						// creating the user
						var newUser = new User(req.body);
						newUser.password = newUser.generateHash(newUser.password);
						newUser.provider = 'local';
						newUser.created = Date.now();
						newUser.updated = Date.now();
						newUser.save(function(err) 
						{
							if(err) 
							{
								throw err;
							}
							return done(null, newUser);
						});
					}
				});
			} 
			else 
			{
				// everything ok, register the user
				return done(null, req.user);
			}
		});
	}));
	
}