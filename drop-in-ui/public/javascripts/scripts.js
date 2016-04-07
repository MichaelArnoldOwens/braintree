(function($){
      $(function(){
        $('select').selectToAutocomplete();
        $('form').submit(function(){
          alert( $(this).serialize() );
          return false;
        });
      });
    })(jQuery);