# -*- encoding: utf-8 -*-
require File.expand_path('../lib/canjs/rails/version', __FILE__)

Gem::Specification.new do |s|
  s.name        = "canjs-rails"
  s.version     = Canjs::Rails::VERSION
  s.platform    = Gem::Platform::RUBY
  s.authors     = ["Craig Wickesser"]
  s.email       = ["craig@mindscratch.org"]
  s.homepage    = "https://github.com/mindscratch/canjs-rails"
  s.summary     = "Use CanJS with Rails 3.1+"
  s.description = "This gem provides CanJS (for jQuery) for your Rails 3.1+ application."

  s.required_rubygems_version = ">= 1.3.6"
  s.rubyforge_project         = "canjs-rails"

  s.add_dependency "railties", ">= 3.2.0", "< 5.0"
  s.add_dependency "thor",     "~> 0.14"

  s.files        = `git ls-files`.split("\n")
  s.executables  = `git ls-files -- bin/*`.split("\n").map { |f| File.basename(f) }
  s.require_path = 'lib'
end
