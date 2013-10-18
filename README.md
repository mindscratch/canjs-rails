# canjs-rails

CanJS for Rails!

This gem provides:

  * can.js 2.0.0 for jQuery (including all plugins)

This gem requires the asset pipeline, so it should work with Rails 3.1 or later. The version of CanJS included with this gem (can.jquery) requires jQuery, conveniently Rails 3.1 and later includes jquery-rails by default, so you won't need to explicitly install jQuery. However, if you aren't using jquery-rails make sure you install jQuery and require it before can.jquery in your `app/assets/javascripts/application.js`.

## Installation

Add the canjs-rails gem to your Gemfile.

```ruby
gem "canjs-rails"
```

And run `bundle install`. 

### Rails 3.1 or greater (with asset pipeline *enabled*)

To make the core CanJS library available add these lines to `app/assets/javascripts/application.js`:

```js
//= require can.jquery
```

You're done!

## Acknowledgements

Many thanks are due to [the jquery-rails project](https://github.com/rails/jquery-rails/) as it was used as the basis for this gem.

Copyright [Craig Wickesser](http://mindscratch.org), released under the MIT License.
