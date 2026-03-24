"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useMemo } from "react";
import { useAppState } from "@/lib/app-state";
import { navigationItems } from "@/lib/mock-data";
import { IconSymbol } from "@/components/icon-symbol";

function UtilityButton({
  label,
  icon,
  href,
}: {
  label: string;
  icon: string;
  href: string;
}) {
  const router = useRouter();
  return (
    <button
      type="button"
      className="utilityGlyph"
      aria-label={label}
      onClick={() => router.push(href)}
    >
      <IconSymbol name={icon} />
    </button>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    state,
    searchResults,
    setCommandQuery,
  } = useAppState();

  const pageTitle = useMemo(() => {
    const current = navigationItems.find((item) =>
      item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href),
    );
    return current?.label ?? "Dashboard";
  }, [pathname]);

  return (
    <main className="appShell">
      <aside className="sideRail">
        <div className="brandBlock">
          <div className="brandMark">S</div>
          <div className="brandText">
            <strong>Savvy Fraud Intelligence</strong>
            <span>Operations v2.4</span>
          </div>
        </div>

        <nav className="navGroup" aria-label="Primary">
          {navigationItems.map((item) => {
            const active =
              item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.key}
                className={`navButton${active ? " active" : ""}`}
                href={item.href}
              >
                <span className="navIcon">
                  <IconSymbol name={item.icon} />
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="railSpacer" />

        <button
          type="button"
          className="railAction"
          onClick={() => router.push("/investigations/new")}
        >
          + New Investigation
        </button>

        <div className="railMeta">
          <span>System status: stable</span>
          <span>Support: analyst desk</span>
        </div>
      </aside>

      <section className="contentPane">
        <div className="topBar">
          <div className="titleBar">{pageTitle}</div>
          <div className="commandWrap">
            <div className="commandBarFrame">
              <span className="commandIcon">
                <IconSymbol name="search" />
              </span>
              <input
                className="commandBar"
                value={state.commandQuery}
                onChange={(event) => setCommandQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && searchResults[0]) {
                    router.push(searchResults[0].href);
                  }
                }}
                placeholder="Search by alert ID, customer, signal, report or IP..."
              />
            </div>
            {searchResults.length > 0 ? (
              <div className="searchPanel">
                {searchResults.map((result) => (
                  <button
                    key={`${result.kind}-${result.id}`}
                    type="button"
                    className="searchResult"
                    onClick={() => router.push(result.href)}
                  >
                    <span className="searchResultKind">{result.kind}</span>
                    <strong>{result.title}</strong>
                    <span>{result.subtitle}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <div className="utilityCluster">
            <UtilityButton label="Notifications" icon="notify" href="/audit" />
            <UtilityButton label="Help" icon="help" href="/reporting" />
            <UtilityButton label="Settings" icon="settings" href="/dashboard" />
              <div className="userChip">
                <div className="userMeta">
                  <strong>{state.currentUser.name}</strong>
                  <div>{state.currentUser.title}</div>
                </div>
                <div className="avatar" aria-hidden="true">
                  {state.currentUser.name.charAt(0)}
                </div>
              </div>
          </div>
        </div>

        {children}
      </section>
    </main>
  );
}
