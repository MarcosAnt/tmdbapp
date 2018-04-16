/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var app = new Framework7({
  // App root element
  root: '#app',
  // App Name
  name: 'My App',
  // App id
  id: 'com.myapp.test',
  // Enable swipe panel
  panel: {
    swipe: 'left',
  },
  // Add default routes
  routes: [
    {
      name: "index",
      path: '/index/',
      url: 'index.html',
    }
  ],

});

var mainView = app.views.create('.view-main');
var $$ = Dom7;

var apiUrl = "https://api.themoviedb.org/3";
var apiKey = "2f61f54af7b9a969fef402b6eb0703ca";
var compiledMovieList;
var template;
var configuration;

//Faz a requisição a API do TMDB e monta a lista de visualização
function requestForAPI(tp_lista){

  //template = $$('#movie-list').html();
  compiledMovieList = Template7.compile(template);
  
  app.request.json(apiUrl + '/configuration?api_key='+apiKey, function (data) {
    configuration = data;
  
    app.request.json(apiUrl + '/movie/' + tp_lista + '?api_key='+apiKey+'&language=en-US&page=1', function (data) {
  
      for(var i=0; i<data.results.length; i++)
      {
        data.results[i].poster_url = configuration.images.base_url + configuration.images.poster_sizes[3] + data.results[i].backdrop_path
      }
  
      $$("#movie-list").html(compiledMovieList(data));
  
    });
  });  
}

function startApp(){
  //Busca no HTML o template para a lista de filmes ao iniciar o app
  template = $$('#movie-list').html();
  requestForAPI('top_rated');
}

//Carrega lista de filmes "top rated"
$$('#top_rated').on('click', function(){
  requestForAPI('top_rated');
});

//Carrega lista de filmes "popular"
$$('#popular').on('click', function(){
  requestForAPI('popular');
});

//Carrega lista de filmes "upcoming"
$$('#upcoming').on('click', function(){
  requestForAPI('upcoming');
});

//Faz requisição do popup de busca
$$('#searchMovie').on('submit', function (event) {
  //Cancela comportamento padrão do formulário
  event.preventDefault();
  
  //Captura o valor digitado no campo de busca
  var query = $$('input[type=search]').val();
  
  //Monta URL para API de filmes
  var url = apiUrl + '/search/movie?' + 'query=' + query + '&include_adult=false&api_key=' + apiKey;
  
  //Abre janela de informação ao usuário
  app.dialog.preloader("Searching...");

  //Prepara template para resposta da requisição a API
  compiledMovieList = Template7.compile(template);
  
  app.request.json(url, function (data) {

    for(var i=0; i<data.results.length; i++)
    {
      data.results[i].poster_url = configuration.images.base_url + configuration.images.poster_sizes[3] + data.results[i].backdrop_path
    }
    //Fecha janela de informação ao usuário
    app.dialog.close();
    //Monta HTML para exibir
    compiledMovie = Template7.compile(template);
    
    //Exibe HTML da resposta
    $$("#searchresults").html(compiledMovie(data));
  });
});

document.addEventListener('deviceready', startApp, false);
