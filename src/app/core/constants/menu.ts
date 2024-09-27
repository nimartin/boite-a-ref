import { MenuItem } from '../models/menu.model';

export class Menu {
  public static pages: MenuItem[] = [
    {
      group: 'Contenu',
      separator: false,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/home.svg',
          label: 'Refs',
          route: '/refs',
          // children: [
          //   { label: 'Nfts', route: '/dashboard/nfts' },
          //   { label: 'refs', route: '/dashboard/refs' },
          //   { label: 'Podcast', route: '/dashboard/podcast' },
          // ],
        },
        {
          icon: 'assets/icons/heroicons/outline/fire.svg',
          label: 'En ce moment',
          route: '/dashboard/refs',
          // children: [
          //   { label: 'Nfts', route: '/dashboard/nfts' },
          //   { label: 'refs', route: '/dashboard/refs' },
          //   { label: 'Podcast', route: '/dashboard/podcast' },
          // ],
        },

        // {
        //   icon: 'assets/icons/heroicons/outline/lock-closed.svg',
        //   label: 'Auth',
        //   route: '/auth',
        //   children: [
        //     { label: 'Sign up', route: '/auth/sign-up' },
        //     { label: 'Sign in', route: '/auth/sign-in' },
        //     { label: 'Forgot Password', route: '/auth/forgot-password' },
        //     { label: 'New Password', route: '/auth/new-password' },
        //     { label: 'Two Steps', route: '/auth/two-steps' },
        //   ],
        // },
        // {
        //   icon: 'assets/icons/heroicons/outline/shield-exclamation.svg',
        //   label: 'Erros',
        //   route: '/errors',
        //   children: [
        //     { label: '404', route: '/errors/404' },
        //     { label: '500', route: '/errors/500' },
        //   ],
        // },
      ],
    },
    {
      group: 'Collaboration',
      separator: false,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/upload.svg',
          label: 'Upload',
          route: '/refs/upload',
        },
        // {
        //   icon: 'assets/icons/heroicons/outline/gift.svg',
        //   label: 'Gift Card',
        //   route: '/gift',
        // },
        // {
        //   icon: 'assets/icons/heroicons/outline/users.svg',
        //   label: 'Users',
        //   route: '/users',
        // },
      ],
    },
    // {
    //   group: 'Config',
    //   separator: false,
    //   items: [
    //     {
    //       icon: 'assets/icons/heroicons/outline/cog.svg',
    //       label: 'Settings',
    //       route: '/settings',
    //     },
    //     {
    //       icon: 'assets/icons/heroicons/outline/bell.svg',
    //       label: 'Notifications',
    //       route: '/gift',
    //     },
    //     {
    //       icon: 'assets/icons/heroicons/outline/folder.svg',
    //       label: 'Folders',
    //       route: '/folders',
    //       children: [
    //         { label: 'Current Files', route: '/folders/current-files' },
    //         { label: 'Downloads', route: '/folders/download' },
    //         { label: 'Trash', route: '/folders/trash' },
    //       ],
    //     },
    //   ],
    // },
  ];
}
