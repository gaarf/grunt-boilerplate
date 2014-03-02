var expect = require('chai').expect
  , DB = require('../app/server/boot.js').DB
  , User = DB.model('User');

describe('User model', function(){


  it('has correct prototype chain', function(){
    expect(new User()).to.be.an.instanceof(DB.Model);
  });

  it('no id nor timestamps when isNew', function(){
    var model = new User();
    expect(model.isNew()).to.be.true;
    expect(model.get('id')).to.be.undefined;
    expect(model.get('created_at')).to.be.undefined;
    expect(model.get('updated_at')).to.be.undefined;
  });

  describe('validation', function(){

    it('email and first_name must be present', function(done){
      var dude = new User();
      dude.save().catch(function(err){
        expect(err).to.be.an.instanceof(Error);
        expect(err.errors.email.errors).to.not.be.empty;
        expect(err.errors.first_name.errors).to.not.be.empty;
        done();
      });
    });

    it('email must be valid', function(done){
      var dude = new User();
      dude.set('email', 'invalid@email');
      dude.save().catch(function(err){
        expect(err).to.be.an.instanceof(Error);
        expect(err.errors.email.errors).to.not.be.empty;
        done();
      });
    });

  });

  describe('saved instance', function(){

    var email = Date.now()+'@test.com'
      , bob = new User({email: email, password: 'foo'});


    before(function(done) {
      bob.set('full_name','bob smith');
      bob.save().exec(done);
    });


    after(function(done) {
      bob.destroy().exec(done);
    });


    it('id and timestamps are set', function(done){

      User.forge({email:email}).fetch().then(function(model){
        expect(model.get('id')).to.be.a('number');
        expect(model.get('created_at')).to.be.an.instanceof(Date);
        expect(model.get('updated_at')).to.be.an.instanceof(Date);
        done();
      });

    });


    it('split full_name', function(done){

      User.forge({email:email}).fetch().then(function(model){
        expect(model.get('first_name')).to.equal('bob');
        expect(model.get('last_name')).to.equal('smith');
        done();
      });

    });


    it('toJSON hides password', function(done){

      User.forge({email:email}).fetch().then(function(model){
        expect(model.get('password')).to.be.ok;
        expect(model.toJSON()).to.not.have.property('password');
        done();
      });

    });

  });

});

