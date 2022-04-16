import express, { Request, Response, NextFunction } from 'express';

import Contact from "../Models/contact";

import { UserDisplayName } from '../Util/index';

// Display Page Functions

export function DisplayContactListPage(req: Request, res: Response, next: NextFunction): void
{
   // display contacts from the db
  Contact.find(function(err, contactList)
  {
    if(err)
    {
      console.error("Encountered an Error reading from the Database: " + err.message);
      res.end();
    }

    res.render('index', { title: 'Contact-List', page: 'contact-list', contacts: contactList, displayName: UserDisplayName(req) });
  }); 
}

export function DisplayAddPage(req: Request, res: Response, next: NextFunction): void
{
    res.render('index', { title: 'Add', page: 'edit', contact: '', displayName: UserDisplayName(req) });
}

export function DisplayEditPage(req: Request, res: Response, next: NextFunction): void
{
    let id = req.params.id;

  // pass the id to the db and read it in
  Contact.findById(id, {}, {}, function(err, contactToEdit)
  {
    if(err)
    {
      console.error(err);
      res.end(err);
    }

    // show the edit view with the data
    res.render('index', { title: 'Edit', page: 'edit', contact: contactToEdit, displayName: UserDisplayName(req) });
  });
}

// Process Page Functions

export function ProcessAddPage(req: Request, res: Response, next: NextFunction): void
{
    // instantiate a new contact to add
  let newContact = new Contact
  ({
    "FullName": req.body.fullName,
    "ContactNumber": req.body.contactNumber,
    "EmailAddress": req.body.emailAddress
  });

  // db.contacts.insert({contact data goes here...})
  Contact.create(newContact, function(err)
  {
    if(err)
    {
      console.error(err);
      res.end(err);
    }
    // newContact has been added to the db ->  now go back to the contact-list page
    res.redirect('/contact-list');
  }); 
}

export function ProcessEditPage(req: Request, res: Response, next: NextFunction): void
{
    let id = req.params.id;

  // instantiate a new contact object
  let updatedContact = new Contact
  ({
    "_id": id,
    "FullName": req.body.fullName,
    "ContactNumber": req.body.contactNumber,
    "EmailAddress": req.body.emailAddress
  });

  // db.contacts.update({"_id": id}, the stuff to update)
  Contact.updateOne({_id: id}, updatedContact, function(err: ErrorCallback)
  {
    if(err)
    {
      console.error(err);
      res.end(err);
    }

    // the contact has been updated in the db -> now go back to the contact-list
    res.redirect('/contact-list');
  });
}

export function ProcessDeletePage(req: Request, res: Response, next: NextFunction): void
{
    let id = req.params.id;

  // db.contacts.remove({"_id":id})
  Contact.remove({_id: id}, function(err)
  {
    if(err)
    {
      console.error(err);
      res.end(err);
    }

    // delete was successful -> go back to the contact-list
    res.redirect('/contact-list');
  });
}