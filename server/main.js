import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // Código para carregar quando o server é iniciado
});

//Carrega a coleção do MongoDB
export const Images = new Mongo.Collection('images');

/**
 * Funções que rodam no servidor
 */
Meteor.methods({

  /**
   * Função responsável pela inserção das imagens na coleção do MongoDB
   */
  'images.insert'(nome,base64) {
    //
    Images.insert({
      nome, //Nome informado no formulário
      base64, //Imagem convertida em modo texto em Base64
      createdAt: new Date(), //Data que a imagem foi adicionada
      owner: this.userId, //Usuário que adicionou a imagem
      username: Meteor.user().profile.name, //Nome do usuário
    });
  },
  
  /**
   * Função responsável pela remoção das imagens da coleção do MongoDB
   */
  'images.remove'(imageId) {
    //Procura a imagem na coleção pelo ID
    const image = Images.findOne(imageId);
    //Remove a imagem da coleção
    Images.remove(imageId);
  },
  
});