
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from '@radix-ui/react-menubar';
import React from 'react';

import Image from "next/image";
import { SignOutButton } from './sign-out';
import { auth } from '@/app/(auth-pages)/auth';

type UserProfileTypes = {
    isOptionEnabled?: boolean
}

const UserProfileIcon = async (prop: UserProfileTypes) => {
    const Session = await auth();

    // Build initials fallback when no image
    const name = Session?.user?.name || "";
    const initials = name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(part => part[0]?.toUpperCase() || "")
        .join("") || "TU"; // default initials

    const hasImage = Boolean(Session?.user?.image);

    return (
        Session &&
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger>
                    {
                        hasImage ? (
                            <Image
                                src={Session.user!.image as string}
                                className="rounded-full object-center"
                                height={42}
                                width={42}
                                alt="user image"
                            />
                        ) : (
                            <div
                                className="h-[42px] w-[42px] rounded-full bg-[#e5e7eb] flex items-center justify-center border border-[#d1d5db]"
                                aria-label="user initials"
                                title={name || "User"}
                            >
                                <span className="text-sm font-semibold text-[#111827]">{initials}</span>
                            </div>
                        )
                    }
                </MenubarTrigger>

                < MenubarContent className='bg-gray px-4 py-1.5 min-w-[120px] rounded-sm'>
                    <MenubarItem className='text-dark font-semibold hover:border-0 cursor-pointer'>
                        <SignOutButton />
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
};

export default UserProfileIcon;