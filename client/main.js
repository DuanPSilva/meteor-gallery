import { Meteor } from 'meteor/meteor';
import { ServiceConfiguration } from 'meteor/service-configuration';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Accounts } from "meteor/accounts-base";
import { Router } from "meteor/iron:router";

//Módulos adicionais do Meteor
// * accounts-base
// * accounts-ui (Botões de logins nas redes sociais)
// * accounts-github (Login pelo GitHub)
// * accounts-google (Login pelo Google)
// * iron:router (Biblioteca de direcionamento de páginas e navegação)
// * service-configuration (Biblioteca para configuração, usada no arquivo accounts.js)
// * jquery (Biblioteca JQuery)
// * twbs:botstrap (Biblioteca oficial Bootstrap)

//LEMBRAR DO COMANDO NO CONSOLE
//SE NÃO O LOGIN NÃO FUNCIONA
//export ROOT_URL='http://btree-duanps.c9users.io:8080'

Meteor.startup( function() {
  // Set some environment variables...
  process.env.ROOT_URL = 'http://btree-duanps.c9users.io:8080';
  Meteor.absoluteUrl.defaultOptions.rootUrl = 'http://btree-duanps.c9users.io:8080';
});

/****** BANCO DE DADOS ******/
import { Mongo } from 'meteor/mongo';
//Inicia a coleção no MongoDB
export const Images = new Mongo.Collection('images');

//Importa o Html
import './main.html';

//Rota da Página Inicial
Router.route('/',{name: 'home', itemName: 'home'});

//Faz a inscrição na coleção do MongoDB
Template.home.onCreated(function homeOnCreated() {
  Meteor.subscribe('images');
});

/**
 * Eventos do Template HOME
 */
Template.home.events({
  /**
   * Função quando clicar no botão com ID "admin"
   */
  'click #admin': function (e,tmpl){
    //Mostra a modal para adicionar imagens
    $('#imageModal').modal('show');
  }
});

/**
 * Scripts Javascript da página HOME
 */
Template.home.onRendered(function() {
    //Fecha o menu lateral
    $("#menu-close").click(function(e) {
        e.preventDefault();
        $("#sidebar-wrapper").toggleClass("active");
    });
    //Mostra o menu lateral
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#sidebar-wrapper").toggleClass("active");
    });

    //Função que faz a animação das seções quando clica nos itens do menu lateral
    $(function() {
        $('a[href*=#]:not([href=#],[data-toggle],[data-target],[data-slide])').click(function() {
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') || location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    $('html,body').animate({
                        scrollTop: target.offset().top
                    }, 1000);
                    return false;
                }
            }
        });
    });
    var fixed = false;
    $(document).scroll(function() {
        if ($(this).scrollTop() > 250) {
            if (!fixed) {
                fixed = true;
              $('#to-top').show("slow", function() {
                    $('#to-top').css({
                        position: 'fixed',
                        display: 'block'
                    });
                });
            }
        } else {
            if (fixed) {
                fixed = false;
                $('#to-top').hide("slow", function() {
                    $('#to-top').css({
                        display: 'none'
                    });
                });
            }
        }
    });
    
  /**
   * Funções do Mapa de localização
   */
  var onMapMouseleaveHandler = function(event) {
        var that = $(this);
        that.on('click', onMapClickHandler);
        that.off('mouseleave', onMapMouseleaveHandler);
        that.find('iframe').css("pointer-events", "none");
    }
    var onMapClickHandler = function(event) {
            var that = $(this);
            // Disable the click handler until the user leaves the map area
            that.off('click', onMapClickHandler);
            // Enable scrolling zoom
            that.find('iframe').css("pointer-events", "auto");
            // Handle the mouse leave event
            that.on('mouseleave', onMapMouseleaveHandler);
        }
    $('.map').on('click', onMapClickHandler);    
});

/**
 * Mostra as imagens
 */
Template.home.helpers({
  images() {
    const instance = Template.instance();
    return Images.find({}, { sort: { createdAt: -1 } });
  },
});

/**
 * Eventos do Template que mostra as Imagens
 */
Template.image.events({
  //Função quando o usuário clica no botão remover imagem
  'click .delete'() {
    Meteor.call('images.remove', this._id);
  }
});

/**
 * Funções do Template adminAdd (Modal que adiciona imagens)
 */
Template.adminAdd.events({
  /**
   * Botão para Salvar Imagem
   */
  'click #save': function(e) {
    //Pega o nome da imagem do campo input
    var image = {
      name: $('#imageName').val()
    }

    //Pega o arquivo de imagem do campo input
    var target = $('#imageFile').prop('files');
    var file = target[0];
    //Se não tiver arquivo, retorna sem fazer nada
    if (!file) return;

    //Cria um leitor para o arquivo com a API do Html5
    var reader = new FileReader();

    reader.onload = function(event){       
      var buffer = reader.result;
      // Insere a imagem na coleção do MongoDB
      Meteor.call('images.insert', image.name, buffer);
    }

    //Lê o arquivo em formato Base64 para poder adicionar na coleção do MongoDB
    reader.readAsDataURL(file);

    // Limpa os campos do formulário
    $('#imageName').val('');
    $('#imageFile').val('');
    
    // Esconde o modal de adicionar imagem
    $('#imageModal').modal('hide');
  },
});